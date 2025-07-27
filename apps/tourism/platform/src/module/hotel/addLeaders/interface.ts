import { FromSchema } from '../../../containers/passengers/utilities/types';

export type TRoomPrice = {
  price: number | undefined;
  isAvailable: boolean | undefined;
};
export type TRoom = {
  id: string | undefined;
  title: string | undefined;
  leader: {
    id: string | undefined;
    fields: FromSchema[];
  };
  foreingner: TRoomPrice;
  earlyEntry: TRoomPrice;
  lateExit: TRoomPrice;
  extraBed: TRoomPrice & {
    mandatoryChecked: boolean | undefined;
  };
};
export type TRooms = TRoom[];
