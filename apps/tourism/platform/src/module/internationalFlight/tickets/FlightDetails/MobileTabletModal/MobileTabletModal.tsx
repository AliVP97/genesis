import AppBar from '../AppBar';
import Modal from '../Modal';
import TabButtons from '../TabButtons';
import TabPanels from '../TabPanels';
import TripDirectionButtons from '../TripDirectionButtons';
import styles from './MobileTablet.module.scss';
import PriceBottomSheet from './PriceBottomSheet';

const MobileTabletModal = () => (
  <Modal fullScreen className={styles['mobile-tablet-modal']}>
    <AppBar />
    <TripDirectionButtons />
    <TabButtons />
    <TabPanels />
    <PriceBottomSheet />
  </Modal>
);

export default MobileTabletModal;
