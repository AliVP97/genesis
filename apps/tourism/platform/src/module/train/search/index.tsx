import cn from 'classnames';

import HeaderHoc from 'components/headerHoc';
import AvailableDates from 'containers/availableDate';
import { ErrorResponse } from 'services/train/tickets/TTicket';
import { useResponsive } from 'utils/hooks/useResponsive';
import Tickets from '../tickets';
import SelectedTicket from '../tickets/components/selectedTicket';
import { TicketList } from '../tickets/interface';
import { FilterSort, Loader, useFilter } from './components';
import { Fallback } from './components/Fallback';
import { useSearch } from './useSearch';

import style from './style.module.scss';

interface Props {
  isLoginCall: boolean;
}

const SearchTrain = ({ isLoginCall }: Props) => {
  const { isMobile } = useResponsive();
  const {
    locations,
    selectedTickets,
    handleChangeTowardTicket,
    getTicketsLoading,
    isIdleGetTicketList,
    availableDatesContents,
    getTrainListError,
    tickets,
    isFullCapacity,
    handleSelectTicket,
    loading,
    prepareRequestHandler,
    ticketsData,
    departureDate,
    returningDate,
    handleEmptyResultClick,
    isReturnTrip,
  } = useSearch(isLoginCall);

  const filterHookValue = useFilter(ticketsData?.trainLists);

  const hasTickets = !!tickets.length;

  const isShowTicketLoading = isIdleGetTicketList || getTicketsLoading || !isLoginCall;
  const isShowSortSection =
    !isShowTicketLoading && !getTrainListError && hasTickets && !isFullCapacity;
  const isShowFilterSection =
    (!getTrainListError && hasTickets && !isFullCapacity) ||
    (!isMobile && isFullCapacity) ||
    (!isMobile && isShowTicketLoading) ||
    !filterHookValue.isInitialFilter;

  return (
    <div
      className={cn(
        style.container,
        isReturnTrip && style['with-selected-ticket'],
        isFullCapacity && style['full-capacity'],
      )}
    >
      <HeaderHoc>
        <span className="text-3 text-weight-500">
          {locations
            ? `${locations.origin.farsiName} - ${locations.destination.farsiName}`
            : undefined}
        </span>
      </HeaderHoc>
      <div className={style['selected-ticket-section']}>
        {isReturnTrip && (
          <SelectedTicket
            selectedTicket={selectedTickets[0]}
            handleChangeTowardTicket={handleChangeTowardTicket}
            isMobile={isMobile}
          />
        )}
      </div>
      <div className={style['available-dates-section']}>
        {!getTrainListError && (
          <AvailableDates
            returning={isReturnTrip}
            disable={getTicketsLoading}
            startDate={isReturnTrip ? departureDate : undefined}
            daysContents={availableDatesContents}
          />
        )}
      </div>
      <FilterSort
        isLoading={isShowTicketLoading}
        showSort={isShowSortSection}
        showFilter={isShowFilterSection}
        filterHookValue={filterHookValue}
      />
      {isShowTicketLoading ? (
        <Loader className={style['main-section']} />
      ) : (
        <div className={style['main-section']}>
          <Fallback
            hasTickets={hasTickets}
            isInitialFilter={filterHookValue.isInitialFilter}
            errorList={getTrainListError as ErrorResponse}
            removeFilter={filterHookValue.handleRemoveFilterClick}
            retryRequest={prepareRequestHandler}
            goToRootPage={handleEmptyResultClick}
            isFullCapacity={isFullCapacity}
          />
          {hasTickets && (
            <Tickets
              oneWay={!returningDate}
              isReturn={isReturnTrip}
              onSelectTicket={handleSelectTicket}
              tickets={tickets as TicketList}
              isLoading={loading}
              isFullCapacity={isFullCapacity}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTrain;
