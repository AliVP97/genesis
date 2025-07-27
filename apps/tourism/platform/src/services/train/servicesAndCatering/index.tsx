import request from 'services/axios';
import API from 'utils/routes/api';

import { TrainOptionPayload } from './interface';

export const getTrainOption = async (trainId: string) => {
  const { data }: { data: TrainOptionPayload } = await request.get(
    API.TRAIN.GET_TRAIN + `/${trainId}/optionalservices`,
  );
  const { optionalServices } = data;
  return optionalServices;
};

export const getTrainFreeOption = async (trainId: string) => {
  const { data }: { data: TrainOptionPayload } = await request.get(
    API.TRAIN.GET_TRAIN + `/${trainId}/freeoptionalservices`,
  );
  const { optionalServices } = data;
  return optionalServices;
};
