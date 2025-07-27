import style from './style.module.scss';
import { DesktopOriginDestinationLocationCardPropsType } from './types';
import { CloseIcon } from 'assets/icons';
import cn from 'classnames';
import { ServiceDetector } from 'utils/helpers/serviceDetector';

export const LocationCard = ({
  title,
  detail,
  icon,
  onClick,
  showDeleteButton,
  onDelete,
  description,
  sideContent,
  elementName,
  isFocused = false,
}: DesktopOriginDestinationLocationCardPropsType & { isFocused: boolean }) => {
  const service = ServiceDetector();
  const handleClick = () => {
    onClick();
  };
  const handleDeleteButtonClick = () => {
    onDelete && onDelete();
  };
  return (
    <div
      className={cn(
        style['location-card'],
        service !== 'hotel' ? { [style['focused']]: isFocused } : '',
        service === 'flights' ? style['flights'] : '',
      )}
      data-name={elementName}
      onClick={handleClick}
      tabIndex={isFocused ? 0 : -1}
    >
      <div className={cn(style['section'])}>
        <div className={style['icon']}>{icon}</div>
        <div>
          <div>
            <span>{title}</span> <span className={style['airport-name']}>{detail} </span>
          </div>
          <div>
            <span className={cn(style['airport-name'], 'pe-0')}>{description}</span>
          </div>
        </div>
      </div>
      <div className={style['side-content']}>{sideContent}</div>
      {showDeleteButton && (
        <div className={style['delete-button']} onClick={handleDeleteButtonClick}>
          <CloseIcon />
        </div>
      )}
    </div>
  );
};
