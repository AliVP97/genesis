import classNames from 'classnames';
import CardHeaderContainer from './CardHeaderContainer';
import styles from './HighlightedCardHeader.module.scss';
import useCardHeader from './hooks/useCardHeader';

type HighlightedCardHeaderProps = {
  title: string;
};

const HighlightedCardHeader = ({ title }: HighlightedCardHeaderProps) => {
  const { isExpand } = useCardHeader();

  return (
    <CardHeaderContainer
      className={classNames(styles['highlighted-card-header'], isExpand && styles['__expand'])}
    >
      <span className={styles['title']}>{title}</span>
    </CardHeaderContainer>
  );
};

export default HighlightedCardHeader;
