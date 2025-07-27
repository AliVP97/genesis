import { FC } from 'react';

import cn from 'classnames';

import Button from 'components/button';
import DesktopOriginDestination from 'components/desktopOriginDestination';
import OriginDestination from 'components/originDestination';
import DatePicker from 'containers/datepicker/selectDate';
import { useMinPrices } from 'services/bus/minPrices';
import { useResponsive } from 'utils/hooks/useResponsive';
import { useCalendar } from './hooks';
import { useSearch } from './useSearch';
import { isDisable } from './utils';

import styles from './styles.module.scss';

const BusSearchTicket: FC = () => {
  const { isMobile } = useResponsive();

  const { date, setDate, calendarSystem, handleCalendarSystemChange, calendarOccasions } =
    useCalendar();

  const {
    isSuperApp,
    componentProps,
    location,
    activeInput,
    submitSearch,
    searchButtonClicked,
    routeChangeStarted,
  } = useSearch({ date, calendarSystem });

  const { data: dayPrices, isStale, refetch } = useMinPrices(location);

  const onOpenCalendar = () => {
    if (isStale) {
      refetch();
    }
  };

  return (
    <div className={cn('container-xxl p-0 px-3', `${isSuperApp ? styles['is-superapp'] : ''}`)}>
      <div className="row flex-row-reverse g-0 mt-4">
        <div className="col-12 col-lg-4 ps-lg-2">
          {isMobile ? (
            <OriginDestination {...componentProps} />
          ) : (
            <DesktopOriginDestination
              showTransportServiceProviderTitle={true}
              {...componentProps}
            />
          )}
        </div>
        <div className={cn('col-12 col-12 col-lg-4 mb-1 mt-2 mt-lg-0')}>
          <DatePicker
            view={isMobile ? 'mobile' : 'desktop'}
            value={date}
            setValue={setDate}
            range={false}
            title={
              location.origin.cityName +
              (location.origin.cityName && location.destination.cityName ? ' - ' : '') +
              location.destination.cityName
            }
            open={activeInput === 'datepicker'}
            onOpen={onOpenCalendar}
            calendarSystem={calendarSystem}
            onCalendarSystemChange={(e) => {
              handleCalendarSystemChange(e);
            }}
            occasions={calendarOccasions}
            daysContents={dayPrices}
          />
        </div>
        <div
          className={cn(
            'col-lg-2 pe-3 mb-1 col-sm-4 mt-2 mt-lg-0 d-flex align-items-center',
            styles.searchTicket__btn,
          )}
        >
          <Button
            radius
            className={`btn btn-primary d-block w-100`}
            btnType="button"
            onClick={submitSearch}
            loading={searchButtonClicked && routeChangeStarted}
            disabled={isDisable({
              originLocation: location.origin.stationCode,
              destinationLocation: location.destination.stationCode,
              dateFrom: date.from,
            })}
          >
            جستجوی سفر
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusSearchTicket;
