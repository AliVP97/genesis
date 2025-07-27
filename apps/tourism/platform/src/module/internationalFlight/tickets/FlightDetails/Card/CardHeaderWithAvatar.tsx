import { FC, ReactNode } from 'react';
import styles from './CardHeaderWithAvatar.module.scss';
import cn from 'classnames';
import CardHeaderContainer from './CardHeaderContainer';
import { ExtraInfo } from '../TabPanels/FlightDetailsTabPanel/types/common';

export type CardHeaderProps = {
  title: string | ReactNode;
  subtitle: string;
  avatar: ReactNode;
  extraInfo: ExtraInfo;
  avatarTitle: string;
};

const CardHeaderWithAvatar: FC<CardHeaderProps> = ({
  title,
  subtitle,
  avatar,
  avatarTitle,
  extraInfo,
}) => (
  <CardHeaderContainer extraInfo={extraInfo}>
    <div
      className={cn(
        styles['avatar-container'],
        'd-flex flex-column align-items-center justify-content-center text-center',
      )}
    >
      <div className={styles['avatar']}>{avatar}</div>
      <div className={styles['avatar-title']}>{avatarTitle}</div>
    </div>
    <div className="d-flex flex-column gap-2">
      <span className={cn(styles['title'])}>{title}</span>
      {subtitle && <span className={styles['subtitle']}>{subtitle}</span>}
    </div>
  </CardHeaderContainer>
);

export default CardHeaderWithAvatar;
