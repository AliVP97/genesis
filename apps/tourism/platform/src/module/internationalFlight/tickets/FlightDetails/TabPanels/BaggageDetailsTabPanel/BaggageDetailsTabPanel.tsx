import classNames from 'classnames';
import Card, { HighlightedCardHeader } from '../../Card';
import HighlightedCardContent from '../../Card/HighlightedCardContent';
import { TABS } from '../../constants/common';
import TabPanel from '../../Tab/TabPanel';
import useFlight from '../hooks/useFlight';
import BaggageDetails from './BaggageDetails';
import styles from './BaggageDetailsTabPanel.module.scss';
import Title from '../Title';
import getPassengerTypeLabel from './utils/getPassengerTypeLabel';

const BaggageDetailsTabPanel = () => {
  const { flight } = useFlight();
  const baggageInfos = flight?.baggageInfos?.filter(
    (info) => ![undefined, 'PASSENGER_TYPE_UNDEFINED'].includes(info.passengerType),
  );

  return (
    <TabPanel index={TABS.BAGGAGE_DETAILS} className="overflow-auto">
      <Title />
      <div className={styles['tab-panel']}>
        {baggageInfos?.map((info, index) => (
          <Card hasPadding={false} key={index} isExpandable>
            <HighlightedCardHeader title={getPassengerTypeLabel(info.passengerType)} />
            <HighlightedCardContent>
              <div className={classNames('d-flex flex-row', styles['card-content'])}>
                {info.baggageDetails?.map((details, detailsIndex) => (
                  <BaggageDetails key={detailsIndex} {...details} />
                ))}
              </div>
            </HighlightedCardContent>
          </Card>
        ))}
      </div>
    </TabPanel>
  );
};

export default BaggageDetailsTabPanel;
