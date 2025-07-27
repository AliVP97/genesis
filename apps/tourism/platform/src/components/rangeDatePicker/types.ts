export type TRangeDatePickerDate = number | undefined | null;

export type TRangeDatePickerRange = {
  from: TRangeDatePickerDate;
  to: TRangeDatePickerDate;
};

export type TRangeDatePickerCalendarSystem = 'gregorian' | 'jalali';

export type TRangeDatePickerProps = {
  range: TRangeDatePickerRange;
  onSubmit: (props: TRangeDatePickerRange) => void;
  calendarSystem: TRangeDatePickerCalendarSystem;
  title?: string | null;
  allowSimilarDates?: boolean;
  hidden?: boolean;
};
