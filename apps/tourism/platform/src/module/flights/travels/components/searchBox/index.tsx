import cn from 'classnames';
import styles from '../../travels.module.scss';
import dayjs from 'dayjs';
import { ActiveCalender, Calender, CloseCircleIcon, SearchIcon } from 'assets/icons';
import React, { useEffect, useState } from 'react';
import DatePicker, { DateState } from 'containers/datepicker/selectDate';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import HorizontalFilterBox from 'components/horizontalFilterBox';
import { travelFilter, travelFilterOptions } from '../../interface';
import TravelSerachBoxInput from '../serachBoxInput';
import { useCalendarOccasions } from 'utils/hooks/useCalendarOccasions';

type TravelSearchBoxProps = {
  filter: travelFilter;
  setFilter: React.Dispatch<React.SetStateAction<travelFilter>>;
};

const TravelSearchBox = ({ filter, setFilter }: TravelSearchBoxProps) => {
  const { isMobile } = useDeviceDetect();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateState>({
    from: null,
    to: null,
  });

  useEffect(() => {
    if (date.from && date.to) setFilter((prev) => ({ ...prev, date: date }));
  }, [date]);

  const calendarOccasions = useCalendarOccasions();

  return (
    <>
      <div className="mt-3">
        <HorizontalFilterBox
          options={travelFilterOptions}
          selectedItem={filter.orderType}
          setSelectedItem={(value) => setFilter((prev) => ({ ...prev, orderType: value }))}
        />
      </div>
      <div
        className="d-flex pb-3 flex-row  justify-content-between align-items-center mt-3"
        dir="rtl"
      >
        <div className="position-relative w-100 ps-3">
          <SearchIcon className={cn(styles['travels__search-icon'])} />
          <TravelSerachBoxInput
            placeholder={
              filter.date.from && filter.date.to
                ? ` از تاریخ ${dayjs(filter.date.from)
                    .calendar('jalali')
                    .format('YYYY/M/D')} تا تاریخ ${dayjs(filter.date.to)
                    .calendar('jalali')
                    .format('YYYY/M/D')} `
                : 'جستجو'
            }
            isDisabed={!!(filter.date.from && filter.date.to)}
            value={filter.search}
            setValue={(value) => setFilter((prev) => ({ ...prev, search: value }))}
          />
          {(filter.date || filter.search) && (
            <CloseCircleIcon
              className={cn(styles['travels__close-icon'])}
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  date: { from: null, to: null },
                  search: '',
                }));
                setDate({ from: null, to: null });
              }}
            />
          )}
        </div>
        {filter.date.from && filter.date.to ? (
          <ActiveCalender />
        ) : (
          <Calender
            onClick={() => {
              setIsOpen(true);
              setFilter((prev) => ({ ...prev, search: '' }));
            }}
          />
        )}
      </div>
      <DatePicker
        view={isMobile ? 'mobile' : 'desktop'}
        value={date}
        setValue={setDate}
        title=""
        range={true}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        application="myTravels"
        occasions={calendarOccasions}
      />
    </>
  );
};
export default TravelSearchBox;
