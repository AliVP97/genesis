import { LoadingPwaGif } from 'assets/images';
import Modal from './Modal';
import Image from 'next/image';
import styles from './LoaderModal.module.scss';

const LoaderModal = () => (
  <Modal className={styles['modal']}>
    <div className={styles['loader-container']}>
      <Image alt="loading pwa image" src={LoadingPwaGif} height={60} width={90} />
    </div>
  </Modal>
);

export default LoaderModal;
