import { FC } from 'react';
import styles from './Card.module.scss';
import cn from 'classnames';
import { CardProvider } from './CardContext';

type CardProps = {
  className?: string;
  hasBorder?: boolean;
  hasPadding?: boolean;
  isExpandable?: boolean;
  isExpanded?: boolean;
};

const Card: FC<CardProps> = ({
  children,
  className,
  hasBorder = true,
  hasPadding = true,
  isExpandable = false,
  isExpanded = null,
}) => (
  <CardProvider isExpandable={isExpandable} isExpanded={isExpanded}>
    <div
      className={cn(
        styles.card,
        hasBorder && styles.border,
        'd-flex flex-column',
        hasPadding && styles.padding,
        className,
      )}
    >
      {children}
    </div>
  </CardProvider>
);

export default Card;
