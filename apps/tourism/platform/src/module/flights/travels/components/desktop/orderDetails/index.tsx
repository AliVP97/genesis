import { CloseIcon, InfoIcon } from 'assets/icons';
import cn from 'classnames';

import TripDomesticFlightDetails from './domesticFlight';
import TripTrainDetails from './train';
import styles from '../../../travels.module.scss';
import { TTrip } from 'services/trips/types';
import TripBusDetails from './bus';
import TripInternationalFlightDetails from './internationalFlight';
import TripHotelDetails from './hotel';
import TripTourDetails from './tour';
import TripServices from './TripServices';
type TripDetailsProps = {
  details: TTrip;
  onClose: () => void;
};

const TripDetails = ({ details, onClose }: TripDetailsProps) => {
  const tripServices = [
    {
      show: Boolean(details.flightDetails),
      Component: <TripDomesticFlightDetails details={details} />,
    },
    {
      show: Boolean(details.trainDetails),
      Component: <TripTrainDetails details={details} />,
    },
    {
      show: Boolean(details.busDetails),
      Component: <TripBusDetails details={details} />,
    },
    {
      show: Boolean(details.intFlightDetails),
      Component: <TripInternationalFlightDetails details={details} />,
    },
    {
      show: Boolean(details.hotelDetail),
      Component: <TripHotelDetails details={details} />,
    },
    {
      show: Boolean(details.tourDetail),
      Component: <TripTourDetails tourDetails={details.tourDetail} />,
    },
  ];

  const priceLabel =
    details?.intFlightDetails?.itinerary?.tripMode === 'TRIP_MODE_ROUND_TRIP'
      ? 'مجموع قیمت رفت و برگشت : '
      : 'مجموع قیمت :';

  return (
    <div className="container rtl mb-lg-5 ">
      <div className={cn('w-100 d-flex flex-column bg-color-surface mb-3 rounded')}>
        <div className="d-flex flex-row justify-content-between align-items-center px-3 py-3 border-bottom border-blue-grey ">
          <div className="d-flex flex-row ">
            <div>
              <InfoIcon />
            </div>

            <div className="me-1">
              <span className="color-black text-weight-500">اطلاعات سفر</span>
            </div>
          </div>
          <CloseIcon onClick={onClose} />
        </div>
        <div className="p-3 w-100">
          <table
            className={cn(
              styles['travels-container__content__items'],
              'bg-color-surface-container-low w-100',
            )}
          >
            <TripServices data={tripServices} />
          </table>
          {Boolean(details.intFlightDetails) ? (
            <div className="d-flex bg-color-surface-container-low w-100 p-2 mt-2 rounded-3">
              <span className="pe-3 ms-2">{priceLabel}</span>
              <span className="color-primary text-4">
                {details?.intFlightDetails?.itinerary?.priceInfo?.price?.toLocaleString()} ریال{' '}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
