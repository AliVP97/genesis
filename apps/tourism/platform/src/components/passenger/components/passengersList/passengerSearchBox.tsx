import { SearchGrayIcon } from 'assets/icons';
import { HTMLProps } from 'react';
import styles from './searchBox.module.scss';
interface TPassengersSearchBox extends HTMLProps<HTMLInputElement> {
  title: string;
}
const PassengersSearchBox = ({ ...props }: TPassengersSearchBox) => {
  return (
    <>
      <div className={styles['search-box']}>
        <input {...props} />
        <div className={styles['search-box__icon']}>
          <SearchGrayIcon />
        </div>
      </div>
    </>
  );
};

export default PassengersSearchBox;
