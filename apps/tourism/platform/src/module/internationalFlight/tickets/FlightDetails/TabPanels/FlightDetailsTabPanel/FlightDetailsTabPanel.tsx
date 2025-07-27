import styles from './FlightDetailsTabPanel.module.scss';
import { TABS } from '../../constants/common';
import { TabPanel } from '../../Tab';
import cn from 'classnames';
import useFlightDetailsTabPanel from './hooks/useFlightDetailsTabPanel';
import StopDetailsCard from './StopDetailsCard';
import TripDetailsCard from './TripDetailsCard';
import { Fragment } from 'react';
import Title from '../Title';

const FlightDetailsTabPanel = () => {
  const { segments } = useFlightDetailsTabPanel();
  const hasMultipleSegments = segments.length > 1;

  return (
    <TabPanel index={TABS.FLIGHT_DETAILS} className="overflow-auto">
      <Title />
      <div
        className={cn(
          styles['tab-panel'],
          'd-flex flex-column',
          hasMultipleSegments && styles['__has-multiple-segments'],
        )}
      >
        {segments.map(({ tripDetails, stopDetails }, key) => (
          <Fragment key={key}>
            <TripDetailsCard
              {...tripDetails}
              isExpandable={hasMultipleSegments}
              className={cn(hasMultipleSegments && styles['timeline'], styles['__primary'])}
            />
            {stopDetails && (
              <StopDetailsCard
                {...stopDetails}
                className={cn(hasMultipleSegments && styles['timeline'], styles['__secondary'])}
              />
            )}
          </Fragment>
        ))}
      </div>
    </TabPanel>
  );
};

export default FlightDetailsTabPanel;
