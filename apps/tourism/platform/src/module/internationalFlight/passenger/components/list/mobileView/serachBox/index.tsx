import { CloseCircleIcon, SearchIcon } from 'assets/icons';
import { ChangeEvent, HTMLProps } from 'react';
import styles from './searchBox.module.scss';
interface TPassengersSearchBox extends HTMLProps<HTMLInputElement> {
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  value: string;
}
const PassengersSearchBox = ({
  title,
  onClear,
  value,
  placeholder,
  onChange,
}: TPassengersSearchBox) => {
  return (
    <>
      <div className={styles['search-box']}>
        <SearchIcon className={styles['search-box__search-icon']} />
        <input placeholder={placeholder} onChange={onChange} value={value} title={title} />
        {value && (
          <CloseCircleIcon onClick={onClear} className={styles['search-box__close-icon']} />
        )}
      </div>
    </>
  );
};

export default PassengersSearchBox;
