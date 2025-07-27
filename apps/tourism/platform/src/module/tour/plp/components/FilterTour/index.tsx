import Divider from 'components/divider';
import { useRouter } from 'next/router';
import PriceRange from 'containers/filter/priceRange';
import Checkbox from 'components/checkbox';
// import {Star} from 'assets/icons';
import TourFilterChip from './TourFilterChip';
import ToggleButton from './ToggetButton/ToggleButton';
import useTourFilters from './hooks/useTourFilters';
import { TourFiltersType, TransformedDataType } from './interface';
import styles from './FilterTour.module.scss';
import Button from 'components/button';
import { memo, useEffect, useMemo, useRef } from 'react';
import useFiltersBoxSticky from 'containers/filter/filterTicket/hooks/useFiltersBoxSticky';
import { definitions } from 'types/tour';

type FilterTourProps = {
  plpResultNumber: number;
  isMobile?: boolean;
  filtersItems?: definitions['tourSearchResponseFilter'];
  handleFiltersData: (filters: TransformedDataType) => void;
};

const validKeys: (keyof TourFiltersType)[] = [
  'availableMonths',
  'priceRange',
  'accommodationType',
  // 'stars',
  'durations',
  'transportType',
  'facilities',
];

const keyName = {
  availableMonths: 'persianName',
  accommodationType: 'persianName',
  durations: 'title',
  transportType: 'title',
  facilities: 'title',
};

const FilterTour = memo(
  ({ plpResultNumber, isMobile = false, filtersItems, handleFiltersData }: FilterTourProps) => {
    const { query } = useRouter();
    const priceRange = filtersItems?.priceRange?.data
      ? [Number(filtersItems.priceRange.data.min), Number(filtersItems.priceRange.data.max)]
      : [0, 0];

    const { filters, handleFilter, resetFilters } = useTourFilters(
      query,
      validKeys,
      priceRange?.filter((val): val is number => val !== undefined) ?? [0, 0],
    );

    const checkedStatus = (filterObject: string[] | undefined, filterValue: string | undefined) => {
      return filterObject ? filterObject.includes(filterValue || '') : false;
    };

    const transformedData = useMemo(() => {
      const result: TransformedDataType = {};

      // Process availableMonths
      if (filters.availableMonths) {
        const ranges = filters.availableMonths;
        result.availableMonths = ranges
          .map((range) => {
            const [startFrom, startTo] = range.split('_');

            // Check if both startFrom and startTo are valid numbers
            if (
              startFrom !== undefined && // Ensure startFrom is defined
              startTo !== undefined // Ensure startTo is defined
            ) {
              return { startFrom, startTo }; // Return the valid range
            }

            return null; // Return null for invalid ranges
          })
          .filter((range) => range !== null); // Filter out null values (invalid ranges)
      }

      // Process priceRange
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.map(Number);
        result.priceRange = { min, max };
      }

      // Process accommodationType
      if (filters.accommodationType) {
        result.accommodationType = filters.accommodationType;
      }

      // Process stars
      // if (filters.stars) {
      //   result.stars = filters.stars;
      // }

      // Process durations
      if (filters.durations) {
        result.durations = filters.durations;
      }

      // Process transportType
      if (filters.transportType) {
        result.transportType = filters.transportType;
      }

      // Process services
      if (filters.facilities) {
        result.facilities = filters.facilities;
      }

      return result;
    }, [filters]);

    useEffect(() => {
      if (!isMobile) {
        handleFiltersData(transformedData);
      }
    }, [transformedData, isMobile, handleFiltersData]);

    const filtersBox = useRef<HTMLDivElement>(null);
    useFiltersBoxSticky(filtersBox);

    return (
      <aside
        className={isMobile ? styles['filters__is-mobile'] : styles['filters__is-desktop']}
        ref={filtersBox}
      >
        <section>
          <div className="d-flex justify-between align-items-center mb-2 text-3">
            <p className="m-0">فیلتر بر اساس:</p>

            {Object.keys(filters).length > 0 && (
              <button
                onClick={resetFilters}
                className="me-auto bg-transparent color-red border-0 text-3"
              >
                حذف همه
              </button>
            )}
          </div>
          {filtersItems && (
            <TourFilterChip
              filters={filters}
              removeFilter={handleFilter}
              keyName={keyName}
              filtersApiData={filtersItems}
            />
          )}
          <p className="text-3 mt-2">{plpResultNumber} نتیجه یافت شد</p>
        </section>
        {filtersItems?.availableMonths && filtersItems?.availableMonths.data!.length > 0 && (
          <section className="mt-2 mb-2">
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.availableMonths.title}</span>
            <div className="d-flex flex-wrap">
              {filtersItems.availableMonths.data &&
                filtersItems.availableMonths.data.map((item, i) => {
                  return (
                    <ToggleButton
                      key={i + 'availableMonths'}
                      value={`${item.startFrom}_${item.startTo}`}
                      type={'availableMonths' as keyof TourFiltersType}
                      title={item?.persianName || ''}
                      checked={checkedStatus(
                        filters?.availableMonths,
                        `${item.startFrom}_${item.startTo}`,
                      )}
                      handleClick={handleFilter}
                    />
                  );
                })}
            </div>
          </section>
        )}
        {filtersItems?.priceRange && +filtersItems.priceRange.data!.max! > 0 && (
          <section>
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.priceRange.title}</span>
            <div className="mx-2">
              <PriceRange
                data={filters.priceRange ? filters.priceRange.slice(0, 2).map(Number) : undefined}
                handleFilter={(val) => handleFilter(val, 'priceRange')}
                minMax={{
                  min: priceRange[0] || 0,
                  max: priceRange[1] || 0,
                }}
              />
            </div>
          </section>
        )}
        {filtersItems?.accommodationType && filtersItems?.accommodationType.data!.length > 0 && (
          <section className="mt-2 mb-2">
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.accommodationType.title}</span>
            <div className="d-flex flex-wrap">
              {filtersItems.accommodationType.data &&
                filtersItems.accommodationType.data.map((item, i) => {
                  return (
                    <ToggleButton
                      key={i + 'accommodationType'}
                      value={item.key || ''}
                      type={'accommodationType' as keyof TourFiltersType}
                      title={item.persianName || ''}
                      checked={checkedStatus(filters?.accommodationType, item.key)}
                      handleClick={handleFilter}
                    />
                  );
                })}
            </div>
          </section>
        )}
        {/*{filtersItems?.stars && filtersItems.stars.data!.length>0 && (*/}
        {/*  <section className="mt-2 mb-2">*/}
        {/*    <Divider type="horizontal" className="mb-3" />*/}
        {/*    <span className="text-3 mb-2 d-block">*/}
        {/*      {filtersItems.stars.title}*/}
        {/*    </span>*/}
        {/*    <div>*/}
        {/*      {filtersItems.stars.data &&*/}
        {/*        filtersItems.stars.data*/}
        {/*          .sort()*/}
        {/*          .reverse()*/}
        {/*          .map((item, i) => {*/}
        {/*            return (*/}
        {/*              <div*/}
        {/*                key={i + 'starts'}*/}
        {/*                className="d-flex align-items-center cursor-pointer"*/}
        {/*                onClick={() => handleFilter(item.toString(), 'stars')}*/}
        {/*              >*/}
        {/*                <Checkbox*/}
        {/*                  checked={checkedStatus(*/}
        {/*                    filters?.stars,*/}
        {/*                    item.toString(),*/}
        {/*                  )}*/}
        {/*                />*/}
        {/*                {Array.from({length: item}).map((_, index) => (*/}
        {/*                  <span key={index + 'hotelStarts'} className="p-1">*/}
        {/*                    <Star size={22} />*/}
        {/*                  </span>*/}
        {/*                ))}*/}
        {/*              </div>*/}
        {/*            );*/}
        {/*          })}*/}
        {/*    </div>*/}
        {/*  </section>*/}
        {/*)}*/}
        {filtersItems?.durations && filtersItems.durations.data!.length > 0 && (
          <section className="mt-2 mb-2">
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.durations.title}</span>
            <div>
              {filtersItems.durations.data &&
                filtersItems.durations.data.map((item, i) => {
                  return (
                    <div
                      key={i + 'durations'}
                      className="d-flex align-items-center py-1 cursor-pointer"
                      onClick={() => handleFilter(item?.duration || '', 'durations')}
                    >
                      <Checkbox checked={checkedStatus(filters?.durations, item?.duration)} />
                      <span className="text-3">{item.title} شب</span>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
        {filtersItems?.transportType && filtersItems.transportType.data!.length > 0 && (
          <section className="mt-2 mb-2">
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.transportType.title}</span>
            <div className="d-flex flex-wrap">
              {filtersItems.transportType.data &&
                filtersItems.transportType.data.map((item, i) => {
                  return (
                    <ToggleButton
                      key={i + 'transportType'}
                      value={item.key || ''}
                      type={'transportType' as keyof TourFiltersType}
                      title={item.title || ''}
                      checked={checkedStatus(filters?.transportType, item.key)}
                      handleClick={handleFilter}
                    />
                  );
                })}
            </div>
          </section>
        )}
        {filtersItems?.facilities && filtersItems.facilities.data!.length > 0 && (
          <section className="mt-2 mb-2">
            <Divider type="horizontal" className="mb-3" />
            <span className="text-3 mb-2 d-block">{filtersItems.facilities.title}</span>
            <div>
              {filtersItems.facilities.data &&
                filtersItems.facilities.data.map((item, i) => {
                  return (
                    <div
                      key={i + 'facilities'}
                      className="d-flex align-items-center py-1 cursor-pointer"
                      onClick={() => handleFilter(item.key || '', 'facilities')}
                    >
                      <Checkbox checked={checkedStatus(filters?.facilities, item.key || '')} />
                      <span className="text-3">{item.title}</span>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
        {isMobile && (
          <Button
            className={styles['filters__is-mobile__submit']}
            onClick={() => handleFiltersData(transformedData)}
          >
            اعمال فیلترها
          </Button>
        )}
      </aside>
    );
  },
);

FilterTour.displayName = 'FilterTour';
export default FilterTour;
