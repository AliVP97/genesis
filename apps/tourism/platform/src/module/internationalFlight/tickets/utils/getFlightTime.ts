import { components } from 'types/international-flight';

type FlightDateTime = components['schemas']['InternationalFlightPb.FlightDateTime'];

const getFlightTime = (dataTime: FlightDateTime | undefined) =>
  `${dataTime?.dateEn} ${dataTime?.timeEn}`;

export default getFlightTime;
