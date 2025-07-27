import { FC } from 'react';
import { TripDetails } from './types/common';
import Card, { CardContent } from '../../Card';
import InfoBox from './InfoBox';
import TripOverview from './TripOverview';
import Image from 'next/image';
import CardHeaderWithAvatar from '../../Card/CardHeaderWithAvatar';

type TripDetailsCardProps = {
  className: string;
  isExpandable: boolean;
} & TripDetails;

const TripDetailsCard: FC<TripDetailsCardProps> = ({
  title,
  subtitle,
  className,
  extraInfo,
  codeShare,
  avatarLogo,
  avatarTitle,
  tripOverview,
  isExpandable,
  technicalStop,
}) => (
  <Card isExpandable={isExpandable} className={className}>
    <CardHeaderWithAvatar
      avatar={
        <Image
          width={'22px'}
          quality={100}
          height={'22px'}
          src={avatarLogo}
          alt="airline logo"
          className={'rounded-circle'}
        />
      }
      title={title}
      subtitle={subtitle}
      extraInfo={extraInfo}
      avatarTitle={avatarTitle}
    />
    <CardContent>
      <TripOverview {...tripOverview} />
      {codeShare && <InfoBox text={codeShare} />}
      {technicalStop && <InfoBox text={technicalStop} />}
    </CardContent>
  </Card>
);

export default TripDetailsCard;
