import { TripOverviewProps } from '../TripOverview';

export type Segment = {
  stopDetails?: StopDetails;
  tripDetails: TripDetails;
};

export type StopDetails = {
  title: string;
  baggagePolicy?: string;
  transferResponsibility?: string;
};

export type ExtraInfo = {
  fareClass: string | undefined;
  classification: string;
};

export type TripDetails = {
  title: string;
  subtitle: string;
  codeShare?: string;
  avatarLogo: string;
  avatarTitle: string;
  extraInfo: ExtraInfo;
  technicalStop?: string;
  tripOverview: TripOverviewProps;
};
