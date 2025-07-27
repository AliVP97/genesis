import request from 'services/axios';
import { definitions } from 'types/rajatrain';
import API from 'utils/routes/api';

type TCalculateRefundPenaltyResponse = definitions['rajaCalculateRefundPenaltyResponse'];

export const calculateRefundPenalty = async (
  orderId: string,
  trainId: string,
  ticketIds: string[],
) => {
  const { data }: { data: TCalculateRefundPenaltyResponse } = await request.post(
    API.TRAIN.CALCULATE_REFUND_PENALTY(orderId, trainId),
    { ticketIds },
  );
  return data;
};

type TRefundResponse = definitions['rajaSubmitRefundResponse'];

export const refund = async (orderId: string, trainId: string, ticketIds: string[]) => {
  const { data }: { data: TRefundResponse } = await request.post(
    API.TRAIN.REFUND(orderId, trainId),
    { ticketIds },
  );
  return data;
};
