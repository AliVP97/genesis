import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import router from 'next/router';
import jwt_decode from 'jwt-decode';

import { setCookie, removeCookie, getCookie } from 'utils/helpers/coockieHelper';
import { decryptTokens } from 'utils/helpers/tokens';
import { versionGenerator } from 'utils/helpers/versionGenerator';
import { refreshToken as getAccessToken } from './general/login';

export const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Accept-Language': 'fa-IR',
    'Grpc-metadata-Version': versionGenerator() + '',
    client: 'web',
    'Grpc-metadata-Device-Info': 'LG-a65sd14',
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('UATP')
        ? localStorage.getItem('UATP')
        : getCookie('guest_access_token');

      if (token && config.headers) {
        config.headers = {
          'Grpc-metadata-Platform':
            sessionStorage?.getItem('platform') === 'superapp' ? 'WEB' : 'WEBSITE',
          ...config.headers,
        };
        config.headers.Authorization = 'Bearer ' + token;
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    const guestRefreshToken = getCookie('guest_refresh_token') || '';
    const refreshToken = decryptTokens(
      (typeof window !== 'undefined' && localStorage.getItem('UFTP')) || '',
    );

    if (error?.response?.status === 401) {
      if (error.config.url.includes('refreshtoken')) {
        removeCookie('guest_access_token');
        removeCookie('guest_refresh_token');
        removeCookie('mobile');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('UATP');
          localStorage.removeItem('UFTP');
          localStorage.removeItem('ST');
        }
        // Go home:
        void router.push('/');
        throw new Error('Invalid Refresh Token');
      } else if (refreshToken) {
        const accessTokenData = await getAccessToken({
          refresh_token: (refreshToken.refresh_token as string) ?? refreshToken,
        });
        localStorage.setItem('UATP', accessTokenData.access_token);
        setCookie(
          'mobile',
          (jwt_decode(accessTokenData.access_token) as { mobile?: string }).mobile || '-',
          accessTokenData.access_expire_time,
        );

        return api(originalRequest);
      } else {
        // Request new guest access token:
        const guestAccessTokenData = await getAccessToken({
          refresh_token: guestRefreshToken as string,
        });
        setCookie(
          'guest_access_token',
          guestAccessTokenData.access_token,
          guestAccessTokenData.access_expire_time,
        );

        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

const request = {
  get: <T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
    return api.get(endpoint, options);
  },
  post: (
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    return api.post(endpoint, Object.assign({}, data), options);
  },
  put: (endpoint: string, data: unknown, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return api.put(endpoint, data, options);
  },
  patch: (
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    return api.patch(endpoint, Object.assign({}, data), options);
  },
  delete: (endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return api.delete(endpoint, options);
  },
  options: (endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return api.options(endpoint, options);
  },

  head: (endpoint: string, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
    return api.head(endpoint, options);
  },
};

type ApiError = AxiosError<{ message?: string }>;

/**
 * Handles API errors by calling the provided callback or fallback function.
 *
 * @param error - The error object, which can be an AxiosError or a generic Error.
 * @param callback - A callback function that takes a message (string or undefined) and an ApiError object.
 * @param fallback - An optional fallback function that takes the error object.
 */
export function handleApiError(
  error: unknown,
  callback: (message: string | undefined, error: ApiError) => void,
  fallback?: (error: Error | unknown) => void,
) {
  if (error instanceof AxiosError) {
    const apiError = error as ApiError;
    const message = apiError.response?.data?.message;
    callback(message, apiError);
  } else if (error instanceof Error) {
    if (error.message === 'Network Error') {
      // TODO: Handle network error
    }

    fallback?.(error);
  } else {
    fallback?.(error);
  }
}

/**
 * Throws an error with the message from the provided API error.
 *
 * @param error - The error object, which can be an AxiosError or a generic Error.
 * @throws {Error} - An error with the message from the API error, or a generic error message if the error is not an AxiosError.
 */
export function throwApiErrorMessage(
  error: unknown,
  fallback?: (error: Error | unknown) => void,
): never {
  handleApiError(
    error,
    (message, apiError) => {
      throw new Error(message ?? apiError.message);
    },
    fallback,
  );

  // TODO: Implement a better way to handle this
  throw new Error('An unexpected error occurred.');
}

export default request;
