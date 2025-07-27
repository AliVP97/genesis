import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import styles from './Tab.module.scss';
import cn from 'classnames';
import { selectFlightDetailsTab } from 'store/slices/internationalFlight/selectors/flightDetails';
import { flightDetailsTabChanged } from 'store/slices/internationalFlight/flightDetails';
import { Tab as TabType } from '../types/common';

type TabProps = {
  label: string;
  value: TabType;
};

const Tab = ({ label, value }: TabProps) => {
  const dispatch = useAppDispatch();
  const tab = useAppSelector(selectFlightDetailsTab);

  const handleClick = () => {
    dispatch(flightDetailsTabChanged(value));
  };

  return (
    <div className={styles['tab']} onClick={handleClick}>
      <span className={styles.label}>{label}</span>
      <div className={cn(tab === value && styles.indicator)}></div>
    </div>
  );
};

export default Tab;
