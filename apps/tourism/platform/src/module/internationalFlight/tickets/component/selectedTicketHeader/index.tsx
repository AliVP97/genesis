import cn from 'classnames';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import styles from '../../selectedTicket/selectedTicket.module.scss';
import { useResetFilters } from 'utils/hooks/useResetFilters';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
type TSelectedTicketHeaderProps = {
  orderData: GetOrderResponseV2;
  dictionary: TDictionary;
};
const SelectedTicketHeader = ({ orderData, dictionary }: TSelectedTicketHeaderProps) => {
  const { resetInternationalAction } = useResetFilters();
  const { internationalFlightCartObject } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  return (
    <>
      <div
        className={cn(
          styles['selected-ticket__header'],
          'd-flex justify-content-between align-items-center w-100 px-3',
        )}
      >
        <span
          className="color-white"
          onClick={() => {
            if (
              internationalFlightCartObject instanceof Object &&
              'ticketsData' in internationalFlightCartObject
            ) {
              const internationalFlightTracking = new FlightInternationalTracking();
              internationalFlightTracking.removeFromCart(
                internationalFlightCartObject as viewItemListModel,
              );
            }
            resetInternationalAction();
          }}
        >
          تغییر بلیط
        </span>
        <div className="color-white d-flex rtl">
          <span>
            {dictionary?.iataDictionary![orderData!.order!.itinerary!.leavingFlight!.origin!.iata!]
              ?.city?.name?.persian ||
              orderData!.order!.itinerary!.leavingFlight!.origin!.iata!}{' '}
            -{' '}
            {dictionary?.iataDictionary![
              orderData!.order!.itinerary!.leavingFlight!.destination!.iata!
            ]?.city?.name?.persian ||
              orderData!.order!.itinerary!.leavingFlight!.destination!.iata!}
          </span>{' '}
          <span className="pe-3">
            <div className="d-flex">
              {new Date(
                orderData!.order!.itinerary!.leavingFlight?.segments![0].origin?.datetime || '',
              ).toLocaleDateString('fa', {
                day: 'numeric',
                month: 'long',
                weekday: 'long',
              })}
              {orderData.order?.itinerary?.returningFlight?.segments?.length ? (
                <div className="d-flex">
                  <div className="mx-2">-</div>
                  {new Date(
                    orderData!.order!.itinerary!.returningFlight?.segments![0].origin?.datetime ||
                      '',
                  ).toLocaleDateString('fa', {
                    day: 'numeric',
                    month: 'long',
                    weekday: 'long',
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>
          </span>{' '}
        </div>
      </div>
    </>
  );
};

export default SelectedTicketHeader;
