import styles from '../../travels.module.scss';
import cn from 'classnames';

const TravelSearchValidationWarning = () => {
  return (
    <>
      <div
        className={cn(
          styles['travels__search-inout-warning'],
          'd-flex flex-column text-center mt-3',
        )}
      >
        لطفا با اعداد انگلیسی جستجو کنید.
      </div>
    </>
  );
};

export default TravelSearchValidationWarning;
