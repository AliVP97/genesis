import cn from 'classnames';
import styles from '../../travels.module.scss';
import { useMemo, useState } from 'react';
import { HotelDetailsTabType, TourDetailsTabType, TravelDetailsTabType } from '../../interface';

import TravelTabSelector from '../tabSelector';

import Spinner from 'components/spinner';
import { TTrip } from 'services/trips/types';
import DomesticFlightTicket from './domesticFlight';
import DomesticFlightPassenger from '../passenger/flight';
import TrainTicket from './train';
import TrainPassenger from '../passenger/train';
import BusTicket from './bus';
import BusPassenger from '../passenger/bus';
import InternationalFlightTicket from './internationalFlight';
import InternationalFlightPassenger from '../passenger/internationalFlight';
import HotelTicket from './hotel';
import HotelPassenger from '../passenger/hotel';
import TourTicket from './tour';
import TourPassenger from '../passenger/tour';

type TTravelTicketDetails = {
  details: TTrip;
  isLoading: boolean;
};

const TravelTicketDetails = ({ details, isLoading }: TTravelTicketDetails) => {
  const tabType = useMemo(() => {
    if (details) {
      if (details?.hotelDetail) {
        return HotelDetailsTabType;
      } else if (details?.tourDetail) {
        return TourDetailsTabType;
      } else {
        return TravelDetailsTabType;
      }
    }
  }, [details.type]);
  const [activeTab, setActiveTab] = useState<string>(tabType?.DETAILS || '');

  return (
    <>
      <div className="py-4 d-flex justify-content-center">
        <span className="text-weight-500">
          {details?.hotelDetail?.hotelInfo !== undefined ? (
            <span>اطلاعات رزرو</span>
          ) : (
            <span>اطلاعات سفر</span>
          )}
        </span>
      </div>

      <div className={cn(styles['Details'], 'container w-100 d-flex flex-column rtl')}>
        <div className="border-bottom border-1 mb-4 px-3">
          <TravelTabSelector
            activeTab={activeTab}
            fill={true}
            tabs={tabType || {}}
            setActiveTab={setActiveTab}
          />
        </div>
        {activeTab === tabType?.DETAILS && (
          <>
            {details.flightDetails && <DomesticFlightTicket details={details} />}
            {details.trainDetails != null && <TrainTicket details={details} />}
            {details.busDetails != null && <BusTicket details={details} />}
            {details.intFlightDetails != null && <InternationalFlightTicket details={details} />}
            {details.hotelDetail != null && <HotelTicket details={details} />}
            {details.tourDetail !== null && <TourTicket details={details} />}
          </>
        )}
        {activeTab === tabType?.PASSENGERS && (
          <>
            {details.flightDetails != null && (
              <>
                {details?.flightDetails?.passengers && (
                  <DomesticFlightPassenger
                    arrivalCity={
                      details.flightDetails?.passengers![0].tickets![0].flightInfo?.arrival?.airport
                        ?.city?.name?.farsi
                    }
                    departureCity={
                      details.flightDetails?.passengers![0].tickets![0].flightInfo?.departure
                        ?.airport?.city?.name?.farsi
                    }
                    passengers={details.flightDetails?.passengers}
                  />
                )}
                {details?.flightDetails?.passengers![0].tickets?.length == 2 && (
                  <DomesticFlightPassenger
                    arrivalCity={
                      details.flightDetails?.passengers![0].tickets![1].flightInfo?.arrival?.airport
                        ?.city?.name?.farsi
                    }
                    departureCity={
                      details.flightDetails?.passengers![0].tickets![1].flightInfo?.departure
                        ?.airport?.city?.name?.farsi
                    }
                    passengers={details.flightDetails?.passengers}
                    isReturn={true}
                  />
                )}
              </>
            )}
            {details?.trainDetails != null && (
              <>
                {details?.trainDetails?.trips![0].tickets && (
                  <TrainPassenger
                    arrivalCity={details?.trainDetails?.trips![0].trainInfo?.destinationName}
                    departureCity={details?.trainDetails?.trips![0].trainInfo?.originName}
                    tickets={details?.trainDetails?.trips[0]?.tickets}
                  />
                )}
                {details?.trainDetails?.trips &&
                  details?.trainDetails?.trips[1]?.trainInfo &&
                  details?.trainDetails?.trips[1]?.tickets && (
                    <TrainPassenger
                      arrivalCity={details.trainDetails.trips[1].trainInfo.destinationName}
                      departureCity={details.trainDetails.trips[1].trainInfo.originName}
                      tickets={details.trainDetails.trips[1].tickets}
                    />
                  )}
              </>
            )}
            {details?.busDetails != null && (
              <>
                {details?.busDetails?.passengers && details?.busDetails.refund && (
                  <BusPassenger
                    price={Number(details?.busDetails?.busInfo?.price)}
                    passengers={details?.busDetails?.passengers}
                    seats={details?.busDetails.seats}
                    refund={details?.busDetails.refund}
                    arrivalCity={details.busDetails.busInfo?.destinationCity}
                    departureCity={details.busDetails.busInfo?.originCity}
                  />
                )}
              </>
            )}
            {details.intFlightDetails != null && (
              <>
                <InternationalFlightPassenger
                  destination={
                    (details.intFlightDetails?.itinerary?.leavingFlight?.destination?.iata &&
                      details.intFlightDetails?.iataDictionary![
                        details.intFlightDetails?.itinerary?.leavingFlight?.destination?.iata
                      ]?.city?.name?.farsi) ||
                    details.intFlightDetails?.itinerary?.leavingFlight?.destination?.iata ||
                    ''
                  }
                  origin={
                    (details.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata &&
                      details.intFlightDetails?.iataDictionary![
                        details.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata
                      ]?.city?.name?.farsi) ||
                    details.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata ||
                    ''
                  }
                  passengers={details?.intFlightDetails?.passengers || []}
                  tickets={details?.intFlightDetails?.tickets || []}
                  details={details}
                />

                {details?.intFlightDetails?.itinerary?.tripMode === 'TRIP_MODE_ROUND_TRIP' && (
                  <InternationalFlightPassenger
                    destination={
                      (details.intFlightDetails?.itinerary?.returningFlight?.destination?.iata &&
                        details.intFlightDetails?.iataDictionary![
                          details.intFlightDetails?.itinerary?.returningFlight?.destination?.iata
                        ]?.city?.name?.farsi) ||
                      details.intFlightDetails?.itinerary?.returningFlight?.destination?.iata ||
                      ''
                    }
                    details={details}
                    origin={
                      (details.intFlightDetails?.itinerary?.returningFlight?.origin?.iata &&
                        details.intFlightDetails?.iataDictionary![
                          details.intFlightDetails?.itinerary?.returningFlight?.origin?.iata
                        ]?.city?.name?.farsi) ||
                      details.intFlightDetails?.itinerary?.returningFlight?.origin?.iata ||
                      ''
                    }
                    passengers={details?.intFlightDetails?.passengers || []}
                    tickets={details?.intFlightDetails?.tickets || []}
                    isReturn
                  />
                )}
              </>
            )}
            {details?.hotelDetail != null && (
              <>
                {details?.hotelDetail?.passengers && details?.hotelDetail?.room && (
                  <HotelPassenger
                    passengers={details?.hotelDetail?.passengers}
                    rooms={details?.hotelDetail?.room}
                  />
                )}
              </>
            )}
            {details?.tourDetail !== null && (
              <TourPassenger passengers={details?.tourDetail?.passenger} />
            )}
          </>
        )}
        {isLoading && (
          <div className="my-4">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};
export default TravelTicketDetails;
