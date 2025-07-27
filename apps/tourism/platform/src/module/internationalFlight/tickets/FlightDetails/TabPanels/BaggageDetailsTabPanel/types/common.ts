import { BAGGAGE_LABELS, PASSENGER_LABELS } from '../constants/common';

export type BaggageType = keyof typeof BAGGAGE_LABELS;

export type PassengerType = keyof typeof PASSENGER_LABELS | 'PASSENGER_TYPE_UNDEFINED';
