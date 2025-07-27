import { CloseIcon, InfoIcon } from 'assets/icons';
import DomesticFlightPassenger from '../../passenger/flight';
import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { TTrip } from 'services/trips/types';
import TrainPassenger from '../../passenger/train';
import BusPassenger from '../../passenger/bus';
import InternationalFlightPassenger from '../../passenger/internationalFlight';
import HotelPassenger from '../../passenger/hotel';
import TourPassenger from '../../passenger/tour';

type TravelPassengersProps = {
  selectedTicket: TTrip;
  setPassengersVisible: Dispatch<SetStateAction<boolean>>;
};

const TravelPassengers = ({ selectedTicket, setPassengersVisible }: TravelPassengersProps) => {
  return (
    <>
      <div className="container rtl">
        <div className={cn('w-100 d-flex flex-column bg-color-surface mb-3 rounded')}>
          <div className="d-flex flex-row justify-content-between align-items-center px-3 py-3 border-bottom border-outline-var ">
            <div className="d-flex flex-row ">
              <div className="me-1">
                <span className="color-on-surface text-weight-500">
                  <InfoIcon />{' '}
                  {selectedTicket.hotelDetail !== null ? 'مسافران و اتاق ها' : 'مسافران'}
                </span>
              </div>
            </div>
            <CloseIcon onClick={() => setPassengersVisible(false)} />
          </div>
          <div
            className={cn('d-flex flex-column py-3 px-4')}
            style={{ maxHeight: '70vh', overflowY: 'scroll' }}
          >
            {Boolean(selectedTicket.flightDetails) && (
              <>
                {selectedTicket?.flightDetails?.passengers && (
                  <>
                    <DomesticFlightPassenger
                      arrivalCity={
                        selectedTicket.flightDetails?.passengers![0].tickets![0].flightInfo?.arrival
                          ?.airport?.city?.name?.farsi
                      }
                      departureCity={
                        selectedTicket.flightDetails?.passengers![0].tickets![0].flightInfo
                          ?.departure?.airport?.city?.name?.farsi
                      }
                      passengers={selectedTicket?.flightDetails?.passengers}
                    />

                    {selectedTicket.flightDetails?.passengers![0].tickets!.length > 1 && (
                      <>
                        <DomesticFlightPassenger
                          arrivalCity={
                            selectedTicket.flightDetails?.passengers![0].tickets![1].flightInfo
                              ?.arrival?.airport?.city?.name?.farsi
                          }
                          departureCity={
                            selectedTicket.flightDetails?.passengers![0].tickets![1].flightInfo
                              ?.departure?.airport?.city?.name?.farsi
                          }
                          passengers={selectedTicket?.flightDetails?.passengers}
                          isReturn={true}
                        />
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {Boolean(selectedTicket.trainDetails) && (
              <>
                {selectedTicket.trainDetails?.trips![0].tickets && (
                  <TrainPassenger
                    arrivalCity={selectedTicket.trainDetails?.trips![0]?.trainInfo?.destinationName}
                    departureCity={selectedTicket.trainDetails?.trips![0]?.trainInfo?.originName}
                    tickets={selectedTicket.trainDetails?.trips![0].tickets}
                  />
                )}

                {selectedTicket?.trainDetails!.trips!.length > 1 && (
                  <>
                    {selectedTicket?.trainDetails?.trips![1].tickets && (
                      <TrainPassenger
                        arrivalCity={
                          selectedTicket.trainDetails?.trips![1]?.trainInfo?.destinationName
                        }
                        departureCity={
                          selectedTicket.trainDetails?.trips![1]?.trainInfo?.originName
                        }
                        tickets={selectedTicket?.trainDetails.trips![1].tickets}
                      />
                    )}
                  </>
                )}
              </>
            )}
            {Boolean(selectedTicket.busDetails) && (
              <>
                {selectedTicket.busDetails?.passengers && selectedTicket.busDetails?.refund && (
                  <BusPassenger
                    passengers={selectedTicket.busDetails?.passengers}
                    seats={selectedTicket.busDetails?.seats}
                    price={Number(selectedTicket.busDetails?.busInfo?.price)}
                    arrivalCity={selectedTicket.busDetails?.busInfo?.destinationCity}
                    departureCity={selectedTicket.busDetails?.busInfo?.originCity}
                    refund={selectedTicket.busDetails?.refund}
                  />
                )}
              </>
            )}
            {Boolean(selectedTicket.intFlightDetails) && (
              <>
                {selectedTicket.intFlightDetails?.passengers && (
                  <>
                    <InternationalFlightPassenger
                      destination={
                        (selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.destination
                          ?.iata &&
                          selectedTicket?.intFlightDetails?.iataDictionary![
                            selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.destination
                              ?.iata
                          ]?.city?.name?.farsi) ||
                        selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.destination
                          ?.iata ||
                        ''
                      }
                      origin={
                        (selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata &&
                          selectedTicket?.intFlightDetails?.iataDictionary![
                            selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata
                          ]?.city?.name?.farsi) ||
                        selectedTicket?.intFlightDetails?.itinerary?.leavingFlight?.origin?.iata ||
                        ''
                      }
                      passengers={selectedTicket.intFlightDetails?.passengers}
                      tickets={selectedTicket.intFlightDetails?.tickets || []}
                      details={selectedTicket}
                    />
                    <>
                      {selectedTicket?.intFlightDetails?.itinerary?.tripMode ===
                        'TRIP_MODE_ROUND_TRIP' && (
                        <>
                          <InternationalFlightPassenger
                            destination={
                              (selectedTicket?.intFlightDetails?.itinerary?.returningFlight
                                ?.destination?.iata &&
                                selectedTicket?.intFlightDetails?.iataDictionary![
                                  selectedTicket?.intFlightDetails?.itinerary?.returningFlight
                                    ?.destination?.iata
                                ]?.city?.name?.farsi) ||
                              selectedTicket?.intFlightDetails?.itinerary?.returningFlight
                                ?.destination?.iata ||
                              ''
                            }
                            origin={
                              (selectedTicket?.intFlightDetails?.itinerary?.returningFlight?.origin
                                ?.iata &&
                                selectedTicket?.intFlightDetails?.iataDictionary![
                                  selectedTicket?.intFlightDetails?.itinerary?.returningFlight
                                    ?.origin?.iata
                                ]?.city?.name?.farsi) ||
                              selectedTicket?.intFlightDetails?.itinerary?.returningFlight?.origin
                                ?.iata ||
                              ''
                            }
                            passengers={selectedTicket.intFlightDetails?.passengers}
                            tickets={selectedTicket.intFlightDetails?.tickets || []}
                            details={selectedTicket}
                          />
                        </>
                      )}
                    </>
                  </>
                )}
              </>
            )}
            {Boolean(selectedTicket.hotelDetail) && (
              <HotelPassenger
                rooms={selectedTicket.hotelDetail?.room || []}
                passengers={selectedTicket?.hotelDetail?.passengers || []}
              />
            )}
            {Boolean(selectedTicket.tourDetail) && (
              <TourPassenger passengers={selectedTicket?.tourDetail?.passenger} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelPassengers;
