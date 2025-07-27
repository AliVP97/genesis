export type TSteps = 'path' | 'reason' | 'tickets' | 'detail' | 'finalMessage';
import { TTrip } from 'module/flights/travels/interface';
import { TicketsRefundInfo } from 'services/domestic/refund/interface';

type TSealectdIata = { farsi: string; iata: string; isReturn: boolean };

type TRefundReason =
  | 'REFUNDREASON_FLIGHT_CANCELED'
  | 'REFUNDREASON_BY_CRCN'
  | 'REFUNDREASON_FLIGHT_DELAYED';

type TPathStepProps = {
  selectedDepartureIata: TSealectdIata;
  order: TTrip;
  setSelectedDepartureIata: React.Dispatch<React.SetStateAction<TSealectdIata>>;
  onClose: () => void;
  setStep: React.Dispatch<React.SetStateAction<TSteps>>;
};

type TTicketsStepProps = {
  order: TTrip;
  selectedDepartureIata: TSealectdIata;
  setSelectedTickets: React.Dispatch<React.SetStateAction<Array<string>>>;
  selectedTickets: Array<string>;
};

type TDetailsStepProps = {
  calcRefundData: TicketsRefundInfo | undefined;
  order: TTrip;
};
