import { toDaysContents } from 'module/train/tickets/helper';
import { TrainResponse } from 'services/train/tickets/interface';

export const useAvailableDatesContents = (
  ticketsData: TrainResponse | undefined,
  isReturning: boolean,
) => {
  return toDaysContents({
    calendarData: ticketsData?.trainLists?.[isReturning ? 1 : 0].calendarData,
  });
};
