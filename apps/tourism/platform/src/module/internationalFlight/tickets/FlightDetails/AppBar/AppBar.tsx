import { FC } from 'react';
import styles from './AppBar.module.scss';
import { BackArrowIcon } from 'assets/icons';
import useModal from '../hooks/useModal';

const AppBar: FC = () => {
  const { handleClose } = useModal();

  return (
    <div className={styles['app-bar']}>
      <BackArrowIcon className={styles.icon} onClick={handleClose} />
      <span className={styles.title}>اطلاعات پرواز</span>
    </div>
  );
};

export default AppBar;
