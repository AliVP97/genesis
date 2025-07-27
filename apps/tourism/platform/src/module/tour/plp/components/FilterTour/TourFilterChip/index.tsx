import { CloseCircleWhiteIcon } from 'assets/icons';
import cn from 'classnames';
import styles from './TourFilterChip.module.scss';
import { FilterDataItem, KeyNameForFarsiLabel, TourFiltersType } from '../interface';
import { definitions } from 'types/tour';

type TourFilterChipProps = {
  filters: TourFiltersType;
  removeFilter: (val: string, key: keyof TourFiltersType) => void;
  keyName: KeyNameForFarsiLabel;
  filtersApiData: definitions['tourSearchResponse']['filter'];
};

const convertItemToFarsi = (
  filters: definitions['tourSearchResponse']['filter'],
  key: keyof TourFiltersType,
  item: string,
  keyName: KeyNameForFarsiLabel,
): string => {
  const filterData = filters?.[key]?.data;

  if (Array.isArray(filterData)) {
    const isFilterDataItemArray = (data: unknown[]): data is FilterDataItem[] =>
      data.every(
        (val) =>
          typeof val === 'object' &&
          val !== null &&
          ('key' in val || 'duration' in val || 'startFrom' in val),
      );

    if (isFilterDataItemArray(filterData)) {
      const result = filterData.find((val) => {
        if (val?.key === item || val?.duration === item) {
          return true;
        }
        if (val?.startFrom && item.includes('_')) {
          const [startFrom] = item.split('_');
          return val.startFrom === startFrom;
        }
        return false;
      });

      // Return the corresponding Farsi label or the original item
      if (result) {
        const labelKey = keyName[key as keyof KeyNameForFarsiLabel];
        return result[labelKey as keyof FilterDataItem] ?? item;
      }
    }
  }

  // Handle cases where `filterData` is an object (e.g., price range)
  if (typeof filterData === 'object' && filterData !== null) {
    if ('min' in filterData && 'max' in filterData) {
      return `${filterData.min} - ${filterData.max}`;
    }
  }

  // Return the item itself as fallback
  return item;
};

let initialPrice = false;

const renderItem = (
  key: keyof TourFiltersType,
  item: string,
  keyName: KeyNameForFarsiLabel,
  filtersApiData: definitions['tourSearchResponse']['filter'],
) => {
  if (key === 'priceRange') {
    let rangeLabel;
    if (!initialPrice) {
      initialPrice = true;
      rangeLabel = 'از';
    } else {
      initialPrice = false;
      rangeLabel = 'تا';
    }
    return (
      <span>
        {' '}
        {rangeLabel} {Number(item).toLocaleString()} ریال
      </span>
    );
  }
  // if (key === 'stars') {
  //   return <span> هتل {item} ستاره </span>;
  // }
  if (key in keyName) {
    return <span>{convertItemToFarsi(filtersApiData, key, item, keyName)}</span>;
  }
  return <span>{item}</span>;
};

const TourFilterChip = ({
  filters,
  removeFilter,
  keyName,
  filtersApiData,
}: TourFilterChipProps) => {
  return (
    <div className="d-flex flex-wrap text-3">
      {Object.entries(filters).map(([key, value]) =>
        value.map((item: string, index: number) => (
          <div key={`${key}-${index}`} className={styles['remove-filter']}>
            {renderItem(key as keyof TourFiltersType, item, keyName, filtersApiData)}
            <button
              onClick={() => removeFilter(item, key as keyof TourFiltersType)}
              className={cn(styles['remove-filter__icon'], 'border-0 bg-transparent')}
            >
              <CloseCircleWhiteIcon />
            </button>
          </div>
        )),
      )}
    </div>
  );
};

export default TourFilterChip;
