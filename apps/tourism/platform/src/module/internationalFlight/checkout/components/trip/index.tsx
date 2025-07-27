import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import { useConvertDate } from 'module/internationalFlight/tickets/hooks/useConvertDate';
import { useDictionary } from 'module/internationalFlight/tickets/hooks/useDictionary';
import styles from '../../../tickets/ticket/Ticket.module.scss';
import { Airplane } from 'assets/images';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import classNames from 'classnames';
import { components } from 'types/international-flight';
import getFlightTime from 'module/internationalFlight/tickets/utils/getFlightTime';

type FlightV2 = components['schemas']['InternationalFlightPb.ItineraryV2']['returningFlight'];

export const DetailItem = ({
  type,
  flight,
  dictionary,
  cabinTypeTitle,
}: {
  cabinTypeTitle: string | undefined;
  type: string;
  flight: FlightV2 | undefined;
  dictionary: TDictionary;
}) => {
  const { airLineLogoMapper } = useDictionary({ flight, dictionary });
  const logoUrl = airLineLogoMapper();

  const { departureFullTime } = useConvertDate(flight, 'checkout');

  return (
    <div>
      <span className="d-flex justify-content-center text-4 color-white text-weight-500">
        <div className="d-flex flex-column text-center">
          <div className="d-flex">
            <div>{departureFullTime}</div>
            {type == 'toward' ? (
              <span className="ps-1">:رفت</span>
            ) : type == 'backward' ? (
              <span className="ps-1">:برگشت</span>
            ) : (
              ''
            )}
          </div>
          <div>
            {DATE_UTILS.formatDate(
              new Date(getFlightTime(flight?.origin?.flightDateTime)).getTime(),
              {
                lang: 'en',
                showWeekDay: false,
              },
            )}
          </div>
        </div>
      </span>
      <div className="d-flex align-items-center justify-content-between ms-3 me-3">
        <div className={classNames('d-flex flex-column', styles.point)}>
          <span className="text-3 d-block color-white text-start">
            {(flight &&
              dictionary.iataDictionary![flight.destination!.iata!]?.city?.name?.persian) ||
              '-'}{' '}
          </span>
          <span className="text-weight-500 text-6 color-white">
            {flight?.destination?.flightDateTime?.timeEn}
          </span>
          <span className=" text-3 color-white">({flight?.destination?.iata})</span>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-auto mb-auto">
          {logoUrl.slice(0, 2).map((item) => (
            <div key={flight?.flightId} className={styles.logo}>
              <Image
                loader={customLoader}
                src={logoUrl.length != 0 ? `${item}` : Airplane}
                alt="airline logo"
                width={'32px'}
                height={'32px'}
                quality={100}
                className="bg-color-white rounded-circle"
              />
            </div>
          ))}
        </div>
        <div className={classNames('d-flex flex-column text-end', styles.point)}>
          <span className={'text-3 d-block color-white text-end'}>
            {(flight && dictionary.iataDictionary![flight.origin!.iata!]?.city?.name?.persian) ||
              '-'}
          </span>
          <span className="text-weight-500 text-6 color-white">
            {flight?.origin?.flightDateTime?.timeEn}
          </span>
          <span className=" text-3 color-white text-end">({flight?.origin?.iata})</span>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center">
        <span className="color-white text-2">
          {flight &&
            flight.segments &&
            flight.segments
              .reduce((uniqueItems: string[], item) => {
                const airlineName =
                  dictionary.airlineDictionary![item.operatingAirlineCode!]?.name?.english;
                if (airlineName && !uniqueItems.includes(airlineName)) {
                  uniqueItems.push(airlineName);
                }
                return uniqueItems;
              }, [])
              .join(' / ')}
        </span>
        <span className="text-2 color-white d-block mb-2 justify-content-center align-self-center">
          {cabinTypeTitle}
        </span>
      </div>
    </div>
  );
};
