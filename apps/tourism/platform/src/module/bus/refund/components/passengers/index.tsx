import { Passenger } from 'assets/icons';
import cn from 'classnames';
import { TBusOrder } from 'services/bus/order/interface';
import styles from '../../refund.module.scss';
import RadioElement from '../../../../../components/radio';
type TPassengersProps = {
  order: TBusOrder;
};

function Passengers({ order }: TPassengersProps) {
  return (
    <>
      <div className="d-md-none w-100 card border-0 shadow-sm rtl">
        <div
          className={cn('bg-color-surface-container w-100 py-3 rounded-top text-end px-3 d-flex')}
        >
          {' '}
          <div className="col-6">
            <Passenger />
            <b className="pe-2"> مسافران</b>
          </div>
          <div className="col-6 text-start">{order.seats?.length} مسافر</div>
        </div>
        <div>
          <div className="d-flex px-3 text-weight-500">
            <RadioElement
              checked
              label={order.passengers?.leaderName || ''}
              onChange={() => undefined}
              value=""
              className={'p-1'}
            />
          </div>
          <div className="d-flex justify-content-between py-1 p-3 color-on-surface">
            <small>تعداد صندلی</small>
            <small>{order?.seats?.length}</small>
          </div>

          <div className="d-flex justify-content-between py-2 p-3 color-on-surface">
            <small> شماره صندلی </small>
            <small>{order?.seats?.toString()}</small>
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
              <th className="py-3"> سرپرست مسافران </th>
              <th> تعداد صندلی </th>
              <th> شماره صندلی های رزرو شده </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center color-on-surface-var">
              <td className="py-3">
                <small>{order.passengers?.leaderName}</small>
              </td>
              <td>
                <small>{order?.seats?.length}</small>
              </td>
              <td>
                <small>{order?.seats?.toString()}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Passengers;
