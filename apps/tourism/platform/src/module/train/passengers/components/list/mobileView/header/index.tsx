import styles from './header.module.scss';
import { BackIcon } from 'assets/icons';
type THeaderProps = {
  title: string;
  setShow: (e: boolean) => void;
};
const Header = ({ title, setShow }: THeaderProps) => {
  return (
    <>
      <div className={styles['add-passenger-header']}>
        <i onClick={() => setShow(false)}>
          <BackIcon />
        </i>
        <span className="text-3 text-weight-500">{title}</span>
      </div>
    </>
  );
};

export default Header;
