import cn from 'classnames';
import styles from '../../travels.module.scss';

type TravelSerachBoxInputProps = {
  placeholder: string;
  isDisabed: boolean;
  value: string;
  setValue: (e: string) => void;
};

const TravelSerachBoxInput = ({
  placeholder,
  isDisabed,
  value,
  setValue,
}: TravelSerachBoxInputProps) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <input
          className={cn(styles['travels__search-input'], 'color-grey-2')}
          placeholder={placeholder}
          name="searchInput"
          onChange={(e) => setValue(e.target.value)}
          disabled={isDisabed}
          autoFocus={false}
          value={value!}
        />
      </div>
    </>
  );
};

export default TravelSerachBoxInput;
