import Card, { HighlightedCardHeader } from '../../Card';
import HighlightedCardContent from '../../Card/HighlightedCardContent';
import MarkdownParser from './MarkdownParser';
import styles from './VisaPolicyCard.module.scss';

type PolicyCardProps = {
  title: string;
  descriptions: string[];
};

const VisaPolicyCard = ({ title, descriptions }: PolicyCardProps) => (
  <Card hasPadding={false}>
    <HighlightedCardHeader title={title} />
    <HighlightedCardContent>
      {descriptions.map((description, index) => (
        <div className={styles['content']} key={index}>
          <MarkdownParser>{description}</MarkdownParser>
        </div>
      ))}
    </HighlightedCardContent>
  </Card>
);

export default VisaPolicyCard;
