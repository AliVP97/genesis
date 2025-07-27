import VisaPolicyTabPanel from './VisaPolicyTabPanel';
import FlightDetailsTabPanel from './FlightDetailsTabPanel';
import BaggageDetailsTabPanel from './BaggageDetailsTabPanel';
import RefundPolicyTabPanel from './RefundPolicyTabPanel';

const TabPanels = () => (
  <>
    <FlightDetailsTabPanel />
    <VisaPolicyTabPanel />
    <BaggageDetailsTabPanel />
    <RefundPolicyTabPanel />
  </>
);

export default TabPanels;
