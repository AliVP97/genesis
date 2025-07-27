import axios from 'axios';
import { ApiResponse } from './type';

export const fetchCmsData = async ({
  path,
  isDynamicPath = false,
}: {
  path: string;
  isDynamicPath?: boolean;
  isSearchPage?: boolean;
}) => {
  const { data }: { data: ApiResponse } = await axios.post(
    `${process.env.NEXT_PUBLIC_CMS_PAGE_URL}/data`,
    {
      path: path,
      isDynamicPath: isDynamicPath,
    },
  );

  return data;
};

export const fetchDynamicCmsData = async ({
  path,
  isDynamicPath = false,
}: {
  path: string;
  isDynamicPath?: boolean;
  isSearchPage?: boolean;
}) => {
  const { data }: { data: ApiResponse } = await axios.post(
    `${process.env.NEXT_PUBLIC_CMS_PAGE_URL}/landing`,
    {
      path: path,
      isDynamicPath: isDynamicPath,
    },
  );

  return data;
};

export const fetchSupportCmsData = async ({ path }: { path: string }) => {
  const { data }: { data: ApiResponse } = await axios.post(
    `${process.env.NEXT_PUBLIC_CMS_PAGE_URL}/support`,
    {
      path: path,
    },
  );
  return data;
};

export const fetchCmsVisaData = async ({ path }: { path: string }) => {
  const { data }: { data: ApiResponse } = await axios.post(
    `${process.env.NEXT_PUBLIC_CMS_PAGE_URL}/visa`,
    {
      path: path,
    },
  );
  return data;
};
