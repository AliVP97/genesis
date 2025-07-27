import { TDaysContents } from 'containers/datepicker/datepicker/types';
import getDaysContents from './getDaysContents';
import { CalendarPriceResponse } from 'module/internationalFlight/ticketsSearchBox/types/api';
import { CALENDAR_TYPES } from 'module/internationalFlight/ticketsSearchBox/types/common';

jest.mock('dayjs', () => {
  const actualDayjs = jest.requireActual('dayjs');

  return jest.fn((date) => {
    const instance = actualDayjs(date || new Date());
    instance.calendar = jest.fn(() => instance);
    instance.format = jest.fn(() => '20250213');
    return instance;
  });
});

describe('getDaysContents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData: CalendarPriceResponse['calendarData'] = [
    {
      gregorianDepartureDate: '2025-02-13',
      minimumPrice: '<font color="#000">test</font>',
    },
    {
      gregorianDepartureDate: '2025-02-14',
      minimumPrice: '<font color="#000">test</font>',
    },
  ];

  it('should return an empty object if enabled is false', () => {
    const result = getDaysContents(mockData, CALENDAR_TYPES.JALALI, false);
    expect(result).toEqual({});
  });

  it('should correctly map data when using JALALI calendar type', () => {
    const result = getDaysContents(mockData, CALENDAR_TYPES.JALALI, true);

    const expected: TDaysContents = {
      ['20250213']: {
        secondaryData: {
          textContent: 'test',
          style: {
            color: '#000',
          },
        },
      },
    };

    expect(result).toEqual(expected);
  });
});
