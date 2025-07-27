import { FC } from 'react';
import styles from './CardHeaderContainer.module.scss';
import cn from 'classnames';
import useCardHeader from './hooks/useCardHeader';
import CardHeaderAction from './CardHeaderAction';
import { ExtraInfo } from '../TabPanels/FlightDetailsTabPanel/types/common';

type CardHeaderContainerProps = {
  className?: string;
  extraInfo?: ExtraInfo;
};

const CardHeaderContainer: FC<CardHeaderContainerProps> = ({ children, extraInfo, className }) => {
  const { handleClick, isExpand, isExpandable } = useCardHeader();

  return (
    <div
      onClick={handleClick}
      className={cn(
        styles['card-header-container'],
        'd-flex flex-row w-100 align-items-start',
        className,
      )}
    >
      {children}
      <div className="d-flex align-items-center gap-1 me-auto">
        {extraInfo && (
          <div className={styles['extra-info']}>
            <span> {extraInfo.classification}</span>
            <span>{extraInfo?.fareClass}</span>
          </div>
        )}
        {isExpandable && <CardHeaderAction isExpand={isExpand} />}
      </div>
    </div>
  );
};

export default CardHeaderContainer;
