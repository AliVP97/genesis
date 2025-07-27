import Card, { CardContent, SimpleCardHeader } from '../../Card';
import InfoBox from './InfoBox';
import styles from './StopDetailsCard.module.scss';

type StopDetailsCardProps = {
  title: string;
  className: string;
  baggagePolicy?: string;
  transferResponsibility?: string;
};

const StopDetailsCard = ({
  title,
  className,
  baggagePolicy,
  transferResponsibility,
}: StopDetailsCardProps) => {
  const hasContent = Boolean(baggagePolicy || transferResponsibility);

  return (
    <Card className={className} isExpandable={hasContent}>
      <SimpleCardHeader title={title} />
      {hasContent && (
        <CardContent className={styles['card-content']}>
          {transferResponsibility && <InfoBox text={transferResponsibility} />}
          {baggagePolicy && <InfoBox text={baggagePolicy} />}
        </CardContent>
      )}
    </Card>
  );
};

export default StopDetailsCard;
