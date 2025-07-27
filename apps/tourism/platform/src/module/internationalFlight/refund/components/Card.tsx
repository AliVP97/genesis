import classNames from 'classnames';
import styles from './Card.module.scss';
import { PropsWithChildren } from 'react';

type CardProps = {
  avatar: React.ReactNode;
  title: string;
  extraInfo?: string;
  className?: string;
};

const Card = ({ title, avatar, extraInfo, children, className }: PropsWithChildren<CardProps>) => {
  return (
    <div className={classNames(styles.card, className)}>
      <div className={classNames(styles['card-header'], 'd-flex align-items-center')}>
        {avatar}
        <span className={'me-1 fw-500'}>{title}</span>
        {extraInfo && (
          <span className={classNames('me-auto', styles['card-extra-info'])}>{extraInfo}</span>
        )}
      </div>
      <div className={styles['card-body']}>{children}</div>
    </div>
  );
};

export default Card;
