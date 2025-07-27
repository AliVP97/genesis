import FilterTicket from '../filter/filterTicket';
import { Device } from 'utils/interface';
import { Airline } from 'pages/flights/[id]';
import { FilterType } from '../filter/filterTicket/interface';
import styles from './drawer.module.scss';
import cn from 'classnames';
import Backdrop from 'components/modal/backdrop';
import { Dispatch } from 'react';
import { CloseIcon } from 'assets/icons';
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
  expand: boolean;
  setExpand: Dispatch<boolean>;
}
const Drawer = ({
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
  expand,
  setExpand,
}: Props) => {
  return (
    <>
      <div className={styles['hidden']}>
        <div
          className={cn(
            styles['drawer'],
            'bg-color-white',
            expand ? styles['drawer--expand'] : styles['drawer--collapse'],
          )}
        >
          <div
            className={cn(styles['drawer__close'], 'rtl pb-3 text-weight-500')}
            onClick={() => setExpand(false)}
          >
            <CloseIcon />
            <span>فیلتر</span>
          </div>
          <FilterTicket
            device={device}
            breakpoint={breakpoint}
            priceLimit={priceLimit}
            airlineList={airlineList}
            returning={returning}
            updateQuery={updateQuery}
            handleUpdate={handleUpdate}
            tempFilter={tempFilter}
            setTempFilter={setTempFilter}
            submitFilter={submitFilter}
            removeFilter={removeFilter}
            filterLength={filterLength}
          />
        </div>
        <div className={!expand ? styles['drawer__backdrop'] : ''}>
          <Backdrop disable={false} closeModal={() => null} />
        </div>
      </div>
    </>
  );
};
export default Drawer;
