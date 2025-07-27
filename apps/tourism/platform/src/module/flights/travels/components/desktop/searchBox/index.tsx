import cn from 'classnames';
import styles from '../../../travels.module.scss';

type TripsDesktopSearchBoxProps = {
  value: string;
  setValue: (e: string) => void;
};

const TripsDesktopSearchBox = ({ value, setValue }: TripsDesktopSearchBoxProps) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center pb-3">
        <div>
          <input
            type="text"
            placeholder="جستجو"
            value={value}
            className={cn(
              styles['travels-container__search'],
              'text-3 ps-2 pe-4 border-0 bg-color-surface-container-low',
            )}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default TripsDesktopSearchBox;
