import classNames from 'classnames';
import CardContent from './CardContent';
import styles from './HighlightedCardContent.module.scss';

type HighlightedCardContentProps = {
  className?: string;
  children?: React.ReactNode;
};

const HighlightedCardContent = ({ children, className }: HighlightedCardContentProps) => (
  <CardContent className={classNames(styles['card-content'], className)}>{children}</CardContent>
);

export default HighlightedCardContent;
