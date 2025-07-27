export const TABS = {
  FLIGHT_DETAILS: 0,
  BAGGAGE_DETAILS: 1,
  REFUND_POLICY: 2,
  VISA_POLICY: 3,
} as const;

export const TAB_LABELS = {
  [TABS.FLIGHT_DETAILS]: 'جزئیات پرواز',
  [TABS.BAGGAGE_DETAILS]: 'قوانین بار',
  [TABS.REFUND_POLICY]: 'قوانین استرداد',
  [TABS.VISA_POLICY]: 'قوانین ویزا و مسیر',
} as const;

export const TRIP_DIRECTIONS = {
  RETURNING: 1,
  LEAVING: 2,
} as const;
