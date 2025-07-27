import { TTourCalendar } from 'services/tour/v2/detail/types';

export type TFixedBtn = {
  title: string;
  basePrice: string;
  calender: TTourCalendar;
  handleUpdateCalenderState: (id: string) => void;
  handleSubmitDate: () => void;
  defaultDate: string;
  localCalenderState: string;
  isLoading: boolean;
  handleIsOpenBottomSheet: () => void;
  isOpenBottomSheet: boolean;
  isOneDay: boolean;
  packageDateId: string;
  handleGoToCheckOut: (id: string) => void;
};
