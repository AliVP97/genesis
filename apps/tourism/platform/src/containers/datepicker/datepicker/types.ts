import { CSSProperties } from 'react';
import { definitions as TUserManager } from 'types/usermanager';

export type TCalendarEventResponse = TUserManager['CalendarResponseCalendarData'];

export type TCalendarOccasionsResponse = TUserManager['usermanagerCalendarResponse'];

export type TCalendarOccasion = TCalendarEventResponse & {
  monthTitle?: string;
  gregorian?: {
    day?: number | undefined;
    monthTitle?: string;
  };
};

export type TCalendarOccasions = {
  [key: string]: TCalendarOccasion | undefined;
};

export type TDayContent = {
  secondary?: string;
  secondaryData?: { textContent: string; style?: CSSProperties };
};

export type TDaysContents = {
  [key: string]: TDayContent;
};

export type TCalendarSystem = 'JALALI' | 'GREGORIAN';
