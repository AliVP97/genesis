import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './header.module.scss';
import { AddPassengerIcon, BackIcon } from 'assets/icons';
type THeaderProps = {
  title: string;
  setShow: (e: boolean) => void;
  showAdd?: boolean;
  addOnClick?: () => void;
};
const Header = ({ title, setShow, showAdd = false, addOnClick }: THeaderProps) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className={styles['add-passenger-header']}>
      {isMobile && (
        <i onClick={() => setShow(false)}>
          <BackIcon />
        </i>
      )}

      <span className="text-3 text-weight-500">{title}</span>
      {isMobile && showAdd && (
        <div onClick={addOnClick} className={styles['add-passenger-header--add']}>
          <AddPassengerIcon />
        </div>
      )}
    </div>
  );
};

export default Header;
