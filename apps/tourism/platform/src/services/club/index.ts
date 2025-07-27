import request from 'services/axios';
import { definitions } from 'types/campaign';

export const getScore = async () => {
  const { data } = await request.get('/campaign/v1/score');

  return data as definitions['campaignGetScoreResponse'];
};

export type TCalculateScoreBody = definitions['campaignCalculateScore'];

export const calculateScore = async (body: TCalculateScoreBody) => {
  const { data } = await request.post('/campaign/v1/calculate', body, {
    headers: { 'Grpc-Metadata-Device-Id': Date.now() },
  });

  return data as definitions['campaignCalculateUserScoreResponse'];
};
