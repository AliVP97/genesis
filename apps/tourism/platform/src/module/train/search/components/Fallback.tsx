import { FC } from 'react';

import EmptyResult from 'components/emptyResult';
import { ErrorResponse } from 'services/bus/tickets/interface';
import { useResponsive } from 'utils/hooks/useResponsive';
import { FullCapacity } from './FullCapacity';
import { MESSAGES } from '../constants';

type TFallbackProps = {
  className?: string;
  hasTickets: boolean;
  isInitialFilter: boolean;
  errorList: ErrorResponse;
  removeFilter: () => void;
  retryRequest: () => void;
  goToRootPage: () => void;
  isFullCapacity?: boolean;
};

export const Fallback: FC<TFallbackProps> = ({
  className,
  hasTickets,
  isInitialFilter,
  errorList,
  removeFilter,
  retryRequest,
  goToRootPage,
  isFullCapacity,
}) => {
  const { isMobile } = useResponsive();

  const render = () => {
    if (errorList) {
      return (
        <div className="col-8 pb-2 m-auto">
          <EmptyResult
            handleClick={retryRequest}
            // className="m-5"
            type="trainError"
            error={errorList}
          />
        </div>
      );
    }

    if (!hasTickets) {
      if (!isInitialFilter) {
        return (
          <EmptyResult
            handleClick={removeFilter}
            className="mt-3"
            type={'filter'}
            isMobile={isMobile}
            message={MESSAGES.emptyFilter}
          />
        );
      }

      return (
        <EmptyResult
          handleClick={isMobile ? goToRootPage : retryRequest}
          className="m-5 text-center"
          type={'search'}
          isMobile={isMobile}
        />
      );
    }

    if (isFullCapacity) {
      return <FullCapacity />;
    }
  };

  return <div className={className}>{render()}</div>;
};
