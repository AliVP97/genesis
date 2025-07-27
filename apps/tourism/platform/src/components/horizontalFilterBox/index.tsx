import cn from 'classnames';
import { OptionTypes } from 'containers/ticketsSort/sortItems';
import { Device } from 'utils/interface';
import styles from './horizontalFilterBox.module.scss';

type HorizontalFilterBoxProps = {
  options: Array<OptionTypes>;
  selectedItem?: OptionTypes;
  setSelectedItem: (option: OptionTypes) => void;
  title?: string;
};

const HorizontalFilterBox = ({
  options,
  selectedItem,
  setSelectedItem,
  title,
}: HorizontalFilterBoxProps) => {
  const device = Device.mobile;

  return (
    <>
      <div className={cn(styles['mobile-sticky-chips'], 'd-flex w-100')}>
        <div className={styles['sort']}>
          {title && <span className={styles['sort__title']}>{title}</span>}
          {options?.map((item: OptionTypes) => (
            <div
              key={item.value}
              className={cn(
                device !== Device.mobile
                  ? selectedItem?.value === item.value
                    ? styles['sort__item--active']
                    : styles['sort__item']
                  : styles['sort__mobile__item'],
                selectedItem?.value === item.value ? styles['sort__mobile__item--active'] : '',
              )}
              onClick={() => setSelectedItem(item)}
            >
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HorizontalFilterBox;
