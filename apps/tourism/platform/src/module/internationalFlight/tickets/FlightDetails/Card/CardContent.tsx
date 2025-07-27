import { FC } from 'react';
import { useCard } from './CardContext';
import styles from './CardContent.module.scss';
import classNames from 'classnames';

type CardContentProps = {
  className?: string;
};

const CardContent: FC<CardContentProps> = ({ children, className }) => {
  const { isExpand } = useCard();

  if (!isExpand) {
    return null;
  }

  return (
    <div className={classNames('d-flex flex-column', styles['card-content'], className)}>
      {children}
    </div>
  );
};

export default CardContent;
