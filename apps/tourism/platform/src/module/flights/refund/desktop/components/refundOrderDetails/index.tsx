import { AirplaneTicket } from 'assets/icons';
import cn from 'classnames';
import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { ITripDomesticFlight, TTrip } from 'module/flights/travels/interface';
import styles from '../../../refund.module.scss';
import { TSealectdIata } from '../../types';

type RefundOrderDetailsProps = {
  order: TTrip;
  selectedDepartureIata: TSealectdIata;
};

const RefundOrderDetails = ({ order, selectedDepartureIata }: RefundOrderDetailsProps) => {
  const {
    date: dateCalender,
    minute: dateMinute,
    hour: dateHour,
  } = getDateTimeDetails(
    selectedDepartureIata.isReturn ? order?.return?.departureTime : order?.departureTime,
  );

  return (
    <>
      <div className="d-md-none w-100 card border-0 shadow-sm ">
        <div
          className={cn('bg-color-surface-container d-flex w-100 py-3 rounded-top text-end px-3')}
        >
          <div className="col-6">
            <AirplaneTicket />
            <b className="pe-2">
              {order.departureCity} - {order.arrivalCity}
            </b>
          </div>

          <div className="col-6 text-start">{order.passengers?.length} مسافر</div>
        </div>
        <div className="py-2">
          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <span> شماره پرواز</span>
            <span>{order.passengers![0].tickets![0].flightInfo!.flightNumber}</span>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-grey-1">
            <span>کد مرجع PNR </span>
            <span>{(order.details as ITripDomesticFlight).pnr}</span>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-grey-1">
            <span> شرکت هواپیمایی </span>
            <span>
              {!selectedDepartureIata.isReturn
                ? (order.details as ITripDomesticFlight).departureAirline
                : (order?.return?.details as ITripDomesticFlight).departureAirline}
            </span>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-grey-1">
            <span>تاریخ و ساعت حرکت</span>
            <span>
              {dateHour}:{dateMinute} - {dateCalender}
            </span>
          </div>
        </div>
      </div>

      <div className="d-none d-md-block">
        <table
          className={cn(styles.refund__modal__table, 'bg-color-surface-container-low w-100 my-2')}
        >
          <thead>
            <tr
              className={cn(
                styles.refund__modal__table__items__font,
                'bg-color-surface-container color-on-surface w-100  text-center',
              )}
            >
              <th className="py-3"> نوع سفارش</th>
              <th> مسیر </th>
              <th> شرکت هواپیمایی </th>
              <th>تاریخ و ساعت حرکت</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="py-3">
                {order.type == 'TRIPTYPE_DOMESTIC_FLIGHT' ? 'پرواز داخلی' : ''}
              </td>
              <td>
                {!selectedDepartureIata.isReturn
                  ? `${order.departureCity} به ${order.arrivalCity}`
                  : `${order.arrivalCity} به ${order.departureCity}`}
              </td>
              <td>
                {!selectedDepartureIata.isReturn
                  ? (order.details as ITripDomesticFlight).departureAirline
                  : (order?.return?.details as ITripDomesticFlight).departureAirline}
              </td>
              <td>
                {dateHour}:{dateMinute} - {dateCalender}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RefundOrderDetails;
