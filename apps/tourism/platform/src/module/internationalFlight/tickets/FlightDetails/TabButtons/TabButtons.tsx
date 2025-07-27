import cn from 'classnames';
import { TAB_LABELS, TABS } from '../constants/common';
import Tab from '../Tab';
import styles from './TabButtons.module.scss';
import { Tab as TabType } from '../types/common';

const TABS_LIST: TabType[] = [
  TABS.FLIGHT_DETAILS,
  TABS.BAGGAGE_DETAILS,
  TABS.REFUND_POLICY,
  TABS.VISA_POLICY,
];

const TabButtons = () => (
  <div className={cn(styles['tab-buttons'], 'd-flex hr')}>
    {TABS_LIST.map((tab, index) => (
      <Tab label={TAB_LABELS[tab]} value={tab} key={index} />
    ))}
  </div>
);

export default TabButtons;
