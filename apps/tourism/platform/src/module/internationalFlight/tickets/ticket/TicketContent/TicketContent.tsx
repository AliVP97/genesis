import FlightDetails from './FlightDetails';
import React from 'react';
import cn from 'classnames';
import styles from './TicketContent.module.scss';
import { useTicket } from '../TicketContext';
import TripDetails from './TripDetails';
import isFlightRoundTrip from './utils/isFlightRoundTrip';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

function getHasDiffIata(returningIata: string | undefined, leavingIata: string | undefined) {
  if (!returningIata || !leavingIata) {
    return false;
  }

  return returningIata !== leavingIata;
}

export default function TicketContent() {
  const { itinerary, dictionary, curveEdges } = useTicket();
  const {
    returningFlight,
    tripMode,
    IsCodeShare: isCodeShare,
    leavingFlight,
    cabinType,
    flightType,
    providerName,
  } = itinerary ?? {};
  const { isMobile } = useDeviceDetect();
  const isRoundTrip = isFlightRoundTrip(tripMode);
  const hasDiffIata = getHasDiffIata(
    returningFlight?.origin?.iata,
    leavingFlight?.destination?.iata,
  );

  return (
    <div
      className={cn(
        'd-flex gap-2 flex-column position-relative col-md-9 col-12 bg-white',
        styles.root,
        curveEdges && (isMobile ? styles['left-right-curve'] : styles['top-bottom-curve']),
      )}
    >
      <FlightDetails
        flightType={flightType}
        flight={leavingFlight}
        cabinType={cabinType}
        isCodeShare={isCodeShare}
        providerName={providerName}
      />
      <TripDetails
        data={leavingFlight}
        dictionary={dictionary}
        isRoundTrip={isRoundTrip}
        isLeavingFlight
        hasDiffIata={hasDiffIata}
      />
      {isRoundTrip && (
        <>
          <hr className={cn('hr pb-1 mt-1 mb-1', styles.hr)} />
          <TripDetails
            data={returningFlight}
            dictionary={dictionary}
            isRoundTrip={isRoundTrip}
            isLeavingFlight={false}
            hasDiffIata={hasDiffIata}
          />
        </>
      )}
    </div>
  );
}
