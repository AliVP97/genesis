import { FC } from 'react';
import { useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsTab } from 'store/slices/internationalFlight/selectors/flightDetails';
import { Tab } from '../types/common';

type TabPanelProps = {
  index: Tab;
  className?: string;
};

const TabPanel: FC<TabPanelProps> = ({ index, children, className }) => {
  const tab = useAppSelector(selectFlightDetailsTab);

  if (index !== tab) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

export default TabPanel;
