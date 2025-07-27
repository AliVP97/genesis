import React, { useEffect, useMemo, useRef } from 'react';
import useFiltersBoxSticky from './hooks/useFiltersBoxSticky';
import styles from './filterTicket.module.scss';
import FilterButton from 'containers/filter/filterButton';
import Chips from 'containers/filter/filterChips';
import PriceRange from 'containers/filter/priceRange';
import Divider from 'components/divider';
import Airlines from 'containers/filter/airlines';
import AvailableFlights from 'containers/filter/availableFlights';
import {
  backwardDurationFilters,
  towardDurationFilters,
  ticketTypeFilterData,
  flightClassFilterData,
} from './filterItems';
import { useRouter } from 'next/router';
import { FilterType } from './interface';
import { isEqual } from 'lodash';
import { Device } from 'utils/interface';
import cn from 'classnames';
import { Airline } from 'pages/flights/[id]';
import Button from 'components/button';
import classNames from 'classnames';
import { parseQuery } from 'utils/helpers/filters';
import { BreakPoint } from 'utils/hooks/useDetectBreakPoint';

interface Props {
  device: Device;
  breakpoint?: BreakPoint | null;
  priceLimit: { min: number; max: number };
  airlineList: Airline[];
  returning: boolean;
  updateQuery: (filters: FilterType) => void;
  handleUpdate: (value: string, type: keyof FilterType) => void;
  tempFilter: FilterType;
  setTempFilter: (value: FilterType) => void;
  submitFilter?: () => void;
  removeFilter: (value: string, type: keyof FilterType) => void;
  filterLength: number;
  ticketLength?: number;
  filteredLength?: number;
  ticketsWithSeats?: boolean;
  // airlines: {code: string; name: string};
}

const FilterTicket = ({
  device,
  breakpoint,
  priceLimit,
  airlineList,
  returning,
  handleUpdate,
  updateQuery,
  tempFilter,
  setTempFilter,
  submitFilter,
  removeFilter,
  filterLength,
  ticketLength,
  filteredLength,
  ticketsWithSeats,
}: Props) => {
  //Filters of mobile will be reset when departure ticket is selected on round trip flight or when user presses the departure change btn
  useEffect(() => {
    if (filterLength === 0) setTempFilter(filtersInitialValue);
  }, [filterLength]);

  const { query } = useRouter();
  const filtersBox = useRef<HTMLDivElement>(null);
  const filters =
    device === Device.mobile || breakpoint == 'Medium' ? tempFilter : parseQuery(query);
  const memorizedAirlines = useMemo(() => {
    return (
      <Airlines
        airlines={airlineList}
        handleClick={handleUpdate}
        selected={filters['airlines'] ? String(filters['airlines']).split(',') : undefined}
      />
    );
  }, [handleUpdate]);

  const filtersInitialValue = {
    toward: undefined,
    backward: undefined,
    price: undefined,
    airlines: undefined,
    ticketType: undefined,
    flightClass: undefined,
    availableFlights: undefined,
  };

  //Making the filters panel Sticky
  useFiltersBoxSticky(filtersBox);

  return (
    <div className={styles['filter']} ref={filtersBox}>
      {!isEqual(query, { ...query, towards: undefined }) && (
        <>
          <div className="text-weight-500">
            {filteredLength !== ticketLength
              ? `${filteredLength} پرواز از ${ticketLength} پرواز در این تاریخ یافت شد`
              : `${ticketLength} پرواز در این تاریخ یافت شد`}
          </div>
          <div className={styles['filter__header']}>
            <div>
              {device !== Device.mobile ? <span>فیلتر بر اساس</span> : <span>فیلتر نتایج</span>}
              {filterLength !== 0 && (
                <button
                  onClick={() => {
                    updateQuery(filtersInitialValue);
                    setTempFilter(filtersInitialValue);
                  }}
                  className="me-auto"
                >
                  حذف همه
                </button>
              )}
            </div>
            {device === Device.desktop && (
              <div className="d-flex flex-wrap mt-3">
                <Chips handleUpdate={removeFilter} airlinesList={airlineList} />
              </div>
            )}
          </div>
        </>
      )}
      <section title="available" className="mt-4 mb-4">
        <AvailableFlights filters={filters} handleClick={handleUpdate} />
      </section>
      <Divider type="horizontal" />
      {(ticketsWithSeats || query?.price) && (
        <section className="mt-2 mb-2">
          <span className={styles['filter__subTitle']}>قیمت بلیط</span>
          <div title="price" className={cn(styles['filter__price'], 'mx-2 mb-2')}>
            <PriceRange
              data={filters.price ? [filters.price?.min, filters.price?.max] : undefined}
              handleFilter={handleUpdate}
              minMax={priceLimit}
            />
          </div>
          <Divider type="horizontal" />{' '}
        </section>
      )}
      <section title="towardTime" className="mt-2 mb-2">
        <span className={styles['filter__subTitle']}>نوع بلیط</span>
        <div className={styles['filter__section']}>
          {ticketTypeFilterData.map((item, i) => {
            const checked = String(filters?.ticketType)?.split(',').includes(item.value);
            return (
              <FilterButton
                key={i}
                value={item.value}
                type={item.type as keyof FilterType}
                title={item.title}
                checked={checked}
                handleClick={handleUpdate}
              />
            );
          })}
        </div>
      </section>
      <Divider type="horizontal" />
      <section title="towardTime" className="mt-2 mb-2">
        <span className={styles['filter__subTitle']}>کلاس پرواز</span>
        <div className={styles['filter__section']}>
          {flightClassFilterData.map((item, i) => {
            const checked = String(filters?.flightClass)?.split(',').includes(item.value);
            return (
              <FilterButton
                key={i}
                value={item.value}
                type={item.type as keyof FilterType}
                title={item.title}
                checked={checked}
                handleClick={handleUpdate}
              />
            );
          })}
        </div>
      </section>
      {!returning && (
        <>
          <Divider type="horizontal" />
          <section title="towardTime" className="mt-2 mb-2">
            <span className={styles['filter__subTitle']}>
              {query.returningDate ? 'زمان حرکت رفت' : 'ساعت پرواز '}
            </span>
            <div className={styles['filter__section']}>
              {towardDurationFilters.map((item) => {
                const checked = String(filters?.toward)?.split(',').includes(item.value);
                return (
                  <FilterButton
                    key={item.value}
                    value={item.value}
                    type={item.type as keyof FilterType}
                    title={item.title}
                    checked={checked}
                    handleClick={handleUpdate}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
      {returning && (
        <>
          <Divider type="horizontal" />
          <section title="backwardTime" className="mt-2 mb-2">
            <span className={styles['filter__subTitle']}>زمان حرکت برگشت</span>
            <div className={styles['filter__section']}>
              {backwardDurationFilters.map((item) => {
                const checked = String(filters?.backward)?.split(',').includes(item.value);
                return (
                  <FilterButton
                    key={item.value}
                    value={item.value}
                    type={item.type as keyof FilterType}
                    title={item.title}
                    checked={checked}
                    handleClick={handleUpdate}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
      <Divider type="horizontal" />
      {/*      <section title="stopCount">
        <span className={styles['filter__subTitle']}>تعداد توقف</span>
        <div className={styles['filter__section']}>
          {stopCountFilters.map(item => {
            const checked = String(tempFilter?.stops)
              ?.split(',')
              .includes(item.value);
            return (
              <FilterButton
                handleClick={handleUpdate}
                key={item.value}
                value={item.value}
                type={item.type as keyof FilterType}
                title={item.title}
                checked={checked}
              />
            );
          })}
        </div>
      </section>
      <Divider type="horizontal" />*/}
      <section title="airlines" className="mt-2 mb-2">
        {memorizedAirlines}
      </section>
      <Divider type="horizontal" className="d-none" />
      <Button
        btnType="submit"
        className={classNames(styles['filter__button'], 'btn btn-primary')}
        onClick={submitFilter}
      >
        {filterLength ? `اعمال فیلترها (فیلتر ${filterLength})` : `اعمال فیلترها`}
      </Button>
    </div>
  );
};

export default FilterTicket;
