import { FC } from 'react';

import { TicketsSort } from 'containers/ticketsSort';
import { useResponsive } from 'utils/hooks/useResponsive';
import { Device } from 'utils/interface';
import { Filter, TFilterProps } from '../Filter/Filter';

import styles from './FilterSort.module.scss';

type TFilterSortProps = {
  isLoading: boolean;
  showFilter: boolean;
  showSort: boolean;
  filterHookValue: TFilterProps;
};

export const FilterSort: FC<TFilterSortProps> = ({
  isLoading,
  showFilter,
  showSort,
  filterHookValue,
}) => {
  const { isMobile } = useResponsive();

  return isMobile ? (
    <div className={styles['filter-sort-section']} style={{ gridArea: 'filter-sort' }}>
      {showFilter && <Filter isLoading={isLoading} {...filterHookValue} />}
      {showSort && <TicketsSort serviceName="train" device={Device.mobile} />}
    </div>
  ) : (
    <>
      <div style={{ gridArea: 'filter' }}>
        {showFilter && <Filter isLoading={isLoading} {...filterHookValue} />}
      </div>
      <div style={{ gridArea: 'sort' }}>
        {showSort && <TicketsSort serviceName="train" device={Device.desktop} />}
      </div>
    </>
  );
};
