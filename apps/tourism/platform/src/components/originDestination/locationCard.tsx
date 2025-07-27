import cn from 'classnames';

import { DesktopOriginDestinationLocationType, LocationType } from './interface';

import styles from './locationCard.module.scss';

interface Props<D> {
  inputName: LocationType;
  data: DesktopOriginDestinationLocationType<D>;
  onSelect: CallableFunction;

  cityEng?: string;
}

const LocationCard = <D,>({ inputName, data, onSelect, cityEng }: Props<D>) => {
  const handleClick = () => {
    onSelect(data, inputName, cityEng);
  };

  return (
    <div className={cn(styles['card'], 'd-flex align-items-center')} onClick={handleClick}>
      <div className={styles['main-content']}>
        {data?.icon}
        <div>
          <div>
            <span className="text-weight-500 color-on-surface me-2 ms-2 d-inline-block">
              {data?.title}
            </span>
            <span className="text-3 color-on-surface-var d-inline-block">{data?.description}</span>
          </div>
          <div className={cn('me-2', styles['description'])}>{data?.subTitle}</div>
        </div>
      </div>
      <div className={styles['side-content']}>{data?.sideContent}</div>
    </div>
  );
};

export default LocationCard;
