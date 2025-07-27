import { TrainOrder } from 'services/train/orders/interface';
import styles from '../../../styles/invoice.module.scss';
import cn from 'classnames';
import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import {
  trainTicketsCompartmentTotalEmptyCount,
  trainTicketsCompartmentTotalPrice,
  trainTotalTicketsOptionsPrice,
  trainTotalTicketsPrice,
} from 'module/train/checkout/helper';
import { useState } from 'react';
import DesktopFacorDetails from './details';

type DesktopFactorType = {
  order: TrainOrder;
};
const DesktopFactor = ({ order }: DesktopFactorType) => {
  const [open, setOpen] = useState<boolean>(false);
  const compartmentTotalEmptyCount = trainTicketsCompartmentTotalEmptyCount(order);
  return (
    <>
      <div className="px-5">
        <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
          <tr
            className={cn(
              styles['invoice__inside-table__header'],
              'w-100 m-0 color-grey-1 text-center ',
            )}
          >
            <th>
              <span>هزینه بلیط</span>
            </th>
            <th>
              <span>خدمات و پذیرایی</span>
            </th>
            <th>
              <span>
                کوپه دربست{' '}
                {compartmentTotalEmptyCount != 0
                  ? `(${compartmentTotalEmptyCount} صندلی خالی)`
                  : ''}
              </span>
            </th>
            <th>
              <span> تخفیف </span>
            </th>
            <th>
              <span>
                <b className="color-green-1">قابل پرداخت</b>
              </span>
            </th>
          </tr>
          <tbody className={cn(styles['invoice__table__body'])}>
            <tr>
              <td>
                <span className="color-primary">
                  <b>{trainTotalTicketsPrice(order)?.toLocaleString()}</b> ریال
                </span>
              </td>
              <td>
                <span className="color-primary">
                  <b>{trainTotalTicketsOptionsPrice(order)?.toLocaleString()}</b> ریال
                </span>
              </td>
              <td>
                <span className="color-primary">
                  <b>{trainTicketsCompartmentTotalPrice(order)?.toLocaleString()}</b> ریال
                </span>
              </td>
              <td>
                <span className="color-primary">
                  <b>0</b> ریال
                </span>
              </td>
              <td>
                <span className="color-green-1">
                  <b className="font-size-8">{Number(order?.price)?.toLocaleString()}</b> ریال
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {open && <DesktopFacorDetails order={order} />}
      <div className="text-center py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-2">مشاهده جزییات فاکتور</span>
        {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
    </>
  );
};

export default DesktopFactor;
