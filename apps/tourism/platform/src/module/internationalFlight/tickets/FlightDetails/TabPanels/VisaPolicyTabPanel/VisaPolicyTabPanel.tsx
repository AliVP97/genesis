import { TABS } from '../../constants/common';
import TabPanel from '../../Tab/TabPanel';
import Title from '../Title';
import useVisaPolicyTabPanel from './hooks/useVisaPolicyTabPanel';
import VisaPolicyCard from './VisaPolicyCard';
import styles from './VisaPolicyTabPanel.module.scss';

const VisaPolicyTabPanel = () => {
  const { visaPolicies } = useVisaPolicyTabPanel();

  return (
    <TabPanel index={TABS.VISA_POLICY} className="overflow-auto">
      <Title />
      <div className={styles['tab-panel']}>
        {visaPolicies.map((visaPolicy, index) => (
          <VisaPolicyCard key={index} {...visaPolicy} />
        ))}
      </div>
    </TabPanel>
  );
};

export default VisaPolicyTabPanel;
