import CardHeaderContainer from './CardHeaderContainer';
import styles from './SimpleCardHeader.module.scss';

type SimpleCardHeaderProps = {
  title: string;
};

const SimpleCardHeader = ({ title }: SimpleCardHeaderProps) => (
  <CardHeaderContainer>
    <span className={styles['title']}>{title}</span>
  </CardHeaderContainer>
);

export default SimpleCardHeader;
