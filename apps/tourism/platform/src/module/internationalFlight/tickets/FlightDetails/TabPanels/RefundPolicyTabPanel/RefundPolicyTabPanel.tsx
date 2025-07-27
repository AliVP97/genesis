import classNames from 'classnames';
import Card, { HighlightedCardHeader } from '../../Card';
import HighlightedCardContent from '../../Card/HighlightedCardContent';
import { TABS } from '../../constants/common';
import TabPanel from '../../Tab/TabPanel';
import styles from './RefundPolicyTabPanel.module.scss';
import { useAppSelector } from 'store/hook/storeHook';
import { selectFlightDetailsItinerary } from 'store/slices/internationalFlight/selectors/flightDetails';
import Title from '../Title';
import PolicyThroughContact from './PolicyThroughContact';
import { TEXT_DIRECTIONS } from './types/common';

const RefundPolicyTabPanel = () => {
  const itinerary = useAppSelector(selectFlightDetailsItinerary);

  return (
    <TabPanel index={TABS.REFUND_POLICY} className="overflow-auto">
      <Title />
      <div className={styles['tab-panel']}>
        {!itinerary?.refundPolicies?.length && <PolicyThroughContact />}
        {itinerary?.refundPolicies?.map((policy, index) => (
          <Card
            hasPadding={false}
            key={index}
            isExpandable={true}
            isExpanded={
              !(itinerary?.refundPolicies?.length && itinerary?.refundPolicies?.length > 1)
            }
          >
            <HighlightedCardHeader title={policy.title ?? ''} />
            <HighlightedCardContent className={classNames(styles['card-content'], styles['gap-0'])}>
              {policy.descriptions?.map((description, index) => (
                <div
                  key={index}
                  className={classNames(
                    policy.direction === TEXT_DIRECTIONS.LTR && styles['ltr-description'],
                  )}
                  dir={policy.direction === TEXT_DIRECTIONS.LTR ? 'ltr' : 'rtl'}
                >
                  {description}
                </div>
              ))}
            </HighlightedCardContent>
          </Card>
        ))}
      </div>
    </TabPanel>
  );
};

export default RefundPolicyTabPanel;
