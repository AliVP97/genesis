import { BusTicket } from 'assets/icons';
import cn from 'classnames';
import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { TBusOrder } from 'services/bus/order/interface';
import styles from '../../refund.module.scss';

type TTicketProps = {
  order: TBusOrder;
};

function TicketInfo({ order }: TTicketProps) {
  const {
    date: dateCalender,
    minute: dateMinute,
    hour: dateHour,
  } = getDateTimeDetails(order.busInfo?.departureDate);
  return (
    <>
      <div className="d-md-none w-100 card border-0 shadow-sm rtl">
        <div
          className={cn('bg-color-surface-container w-100 py-3 rounded-top text-end px-3 d-flex')}
        >
          <div className="col-6">
            <BusTicket className="fill-on-surface-var" />
            <b className="pe-2">
              {order.busInfo?.originCity} - {order.busInfo?.destinationCity}
            </b>
          </div>
          <div className="col-6 text-start">{order.seats?.length} مسافر</div>
        </div>
        <div className="py-2">
          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <small>شماره خرید:</small>
            <small>{order.ticket?.SaleId}</small>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <small>شماره بلیط:</small>
            <small>{order.ticket?.TicketNumber}</small>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <small> تعاونی: </small>
            <small>{order.busInfo?.companyName}</small>
          </div>
          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <small>تاریخ و ساعت حرکت:</small>
            <small>
              {' '}
              {dateHour}:{dateMinute} - {dateCalender}
            </small>
          </div>
        </div>
      </div>

      <div className="d-none d-md-block rtl">
        <table
          className={cn(
            styles['refund__modal__table'],
            'bg-color-surface-container-low w-100 my-2',
          )}
        >
          <thead>
            <tr
              className={cn(
                styles['refund__modal__table__items__font'],
                'bg-color-surface-container color-on-surface w-100  text-center',
              )}
            >
              <th className="py-3">شماره خرید</th>
              <th> شماره بلیط </th>
              <th> شرکت تعاونی </th>
              <th>تاریخ و ساعت حرکت</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center color-on-surface-var">
              <td className="py-3">
                <small>{order.ticket?.SaleId}</small>
              </td>
              <td>
                <small>{order.ticket?.TicketNumber}</small>
              </td>
              <td>
                <small>{order.busInfo?.companyName}</small>
              </td>
              <td>
                <small>
                  {dateHour}:{dateMinute} - {dateCalender}
                </small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TicketInfo;
