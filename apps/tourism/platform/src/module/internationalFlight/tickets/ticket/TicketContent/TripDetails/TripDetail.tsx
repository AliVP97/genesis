import React from 'react';
import { FlightDictionary } from '../../types/FlightDictionary';
import useTripDetails from './hooks/useTripDetails';
import TripPoint from './TripPoint';
import TripDuration from './TripDuration';
import BaggageDetail from './BaggageDetail';
import AirlineLogos from './AirlineLogos';
import { components } from 'types/international-flight';

type FlightV2 = components['schemas']['InternationalFlightPb.FlightV2'];

export interface TripDetailProps {
  data: FlightV2 | undefined;
  dictionary: FlightDictionary;
  isRoundTrip: boolean;
  isLeavingFlight: boolean;
  hasDiffIata: boolean;
}

export default function TripDetail(props: TripDetailProps) {
  const { hasDiffIata, isLeavingFlight, isRoundTrip, ...rest } = props;
  const {
    destinationTime,
    originTime,
    originIata,
    destinationIata,
    durationText,
    stopDetail,
    stopCount,
    airlines,
    baggageDetail,
    isMobile,
    originNextDay,
    destinationNextDay,
  } = useTripDetails(rest);

  return (
    <>
      <div
        className={
          'd-flex flex-row justify-content-between justify-content-md-between pt-md-3 pb-md-3 align-items-center'
        }
      >
        {!isMobile && <AirlineLogos data={airlines} />}
        <TripPoint
          time={originTime}
          iata={originIata}
          direction={'origin'}
          isRoundTrip={isRoundTrip}
          hasDiffIata={hasDiffIata}
          nextDay={originNextDay}
          isLeavingFlight={isLeavingFlight}
        />
        <TripDuration stopCount={stopCount} stopDetail={stopDetail} durationText={durationText} />
        <TripPoint
          time={destinationTime}
          iata={destinationIata}
          isRoundTrip={isRoundTrip}
          hasDiffIata={hasDiffIata}
          direction={'destination'}
          nextDay={destinationNextDay}
          isLeavingFlight={isLeavingFlight}
        />
        {!isMobile && <BaggageDetail {...baggageDetail} />}
      </div>
      {isMobile && (
        <div className={'d-flex flex-row justify-content-between align-items-center'}>
          <AirlineLogos data={airlines} />
          <BaggageDetail {...baggageDetail} />
        </div>
      )}
    </>
  );
}
