import { Dispatch, FC, SetStateAction } from 'react';

import cn from 'classnames';
import { BottomSheet } from 'react-spring-bottom-sheet';

import Button from 'components/button';
import { TicketsFilter } from 'containers/ticketsFilter';
import { TicketsFilterChips } from 'containers/ticketsFilterChips';
import { useResponsive } from 'utils/hooks/useResponsive';
import { FilterIcon } from 'assets/icons';
import {
  TicketsFilterChangeEventType,
  TicketsFilterStateMemberType,
} from 'containers/ticketsFilter/types';
import Skeleton from 'components/skeleton';

import style from '../../style.module.scss';

export type TFilterProps = {
  isLoading?: boolean;
  tempFilterState: TicketsFilterStateMemberType[];
  filterState: TicketsFilterStateMemberType[];
  isInitialFilter: boolean;
  isBottomSheetVisible: boolean;
  setIsBottomSheetVisible: Dispatch<SetStateAction<boolean>>;
  handleFilterIconClick: () => void;
  handleFilterChange: (newFilterState: TicketsFilterChangeEventType) => void;
  handleDesktopFilterChange: (newFilterState: TicketsFilterChangeEventType) => void;
  handleFilterChipsChange: (newFilterState: TicketsFilterChangeEventType) => void;
  handleFilterSubmit: () => void;
  handleRemoveFilterClick: () => void;
};

export const Filter: FC<TFilterProps> = ({
  isLoading,
  tempFilterState,
  filterState,
  isInitialFilter,
  isBottomSheetVisible,
  setIsBottomSheetVisible,
  handleFilterIconClick,
  handleFilterChange,
  handleDesktopFilterChange,
  handleFilterChipsChange,
  handleFilterSubmit,
  handleRemoveFilterClick,
}) => {
  const { isMobile } = useResponsive();

  const hasFilterState = !!filterState?.length;

  const Mobile = () => {
    return (
      <>
        <div className={style['filter-icon']} onClick={handleFilterIconClick}>
          <FilterIcon />
        </div>
        <TicketsFilterChips state={filterState} onChange={handleFilterChipsChange} />
      </>
    );
  };

  const Desktop = () => (
    <div className="h-100 pt-3 px-1">
      {isLoading ? (
        <Skeleton
          type="filter"
          rtl
          uniqueKey="filter"
          className={'bg-color-white h-100 p-2'}
          height="100%"
          width="100%"
        />
      ) : (
        <>
          {hasFilterState && (
            <div className={style['desktop-filters-header']}>
              <div className={style.title}>فیلتر بر اساس</div>
              {!isInitialFilter && (
                <button className={style['remove-filters']} onClick={handleRemoveFilterClick}>
                  حذف فیلترها
                </button>
              )}
            </div>
          )}
          <TicketsFilterChips state={filterState} onChange={handleFilterChipsChange} />
          <TicketsFilter state={filterState} onChange={handleDesktopFilterChange} />
        </>
      )}
    </div>
  );

  return (
    <>
      {filterState ? isMobile ? <Mobile /> : <Desktop /> : <></>}
      <BottomSheet
        open={isBottomSheetVisible}
        onDismiss={() => {
          setIsBottomSheetVisible(false);
        }}
        snapPoints={({ maxHeight }) => maxHeight * 0.9}
      >
        <div className={style['mobile-tickets-filter']}>
          <div className={style.header}>
            <div className={style.title}>مرتب‌‌ سازی و فیلتر</div>
            <button className={style['remove-filters']} onClick={handleRemoveFilterClick}>
              حذف فیلترها
            </button>
          </div>
          <TicketsFilter state={tempFilterState} onChange={handleFilterChange} />
          <Button
            btnType="submit"
            className={cn(style['submit-button'], 'btn-primary')}
            onClick={handleFilterSubmit}
          >
            اعمال فیلترها
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};
