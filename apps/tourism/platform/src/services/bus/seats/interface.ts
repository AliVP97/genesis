import { definitions } from 'types/bus';

export type BusSeatsResponse = definitions['apibusAvailableSeatsResponse'];

export type TBusSeatAvailability = definitions['apibusAvailability'];

export type TSeat = { seatNumber: number | undefined; availability: string };

export type TAddSeatBody = definitions['BusAddSeatsBody'];
