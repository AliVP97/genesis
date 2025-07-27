import { FC, ReactElement } from 'react';

import Spinner from 'components/spinner';
import { TErrorResponse } from 'services/train/types';

type TLoaderProps = {
  isFetching: boolean;
  error: unknown;
  isError: boolean;
  refetch: () => void;
  children: ReactElement;
};

export const Loader: FC<TLoaderProps> = ({ isFetching, error, isError, refetch, children }) =>
  isFetching ? (
    <div className="p-5">
      <Spinner />
    </div>
  ) : isError ? (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div>
        {(error as TErrorResponse)?.response?.data?.message ||
          'مشکلی در دریافت اطلاعات بوجود آمده است'}
      </div>
      <div className="cursor-pointer color-primary px-4 py-2" onClick={refetch}>
        تلاش مجدد
      </div>
    </div>
  ) : (
    children
  );
