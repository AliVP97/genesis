import React from 'react';
import { TInternationalPassenger, TTrip, TTripsIntFlightTicket } from 'services/trips/types';
import TravelPassenger from '..';
import InternationalFlightPassengerItem from './components/passenger';

type TInternationalFlightPassengerProps = {
  origin: string;
  destination: string;
  passengers: Array<TInternationalPassenger>;
  isReturn?: boolean;
  tickets: Array<TTripsIntFlightTicket>;
  details: TTrip;
};

const InternationalFlightPassenger = ({
  origin,
  destination,
  passengers,
  tickets,
  details,
  isReturn,
}: TInternationalFlightPassengerProps) => {
  return (
    <>
      <TravelPassenger
        arrivalCity={destination}
        departureCity={origin}
        passengersCount={passengers.length}
      >
        <>
          <div>
            {React.Children.toArray(
              passengers?.map((passenger) =>
                React.Children.toArray(
                  <InternationalFlightPassengerItem
                    passenger={passenger}
                    details={details}
                    tickets={tickets}
                    isReturn={isReturn}
                  />,
                ),
              ),
            )}
          </div>
        </>
      </TravelPassenger>
    </>
  );
};

export default InternationalFlightPassenger;
