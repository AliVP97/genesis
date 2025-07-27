import { FC, FormEventHandler } from 'react';

import cn from 'classnames';
import { useQuery } from 'react-query';

import { Passenger } from 'assets/icons';
import { useResponsive } from 'utils/hooks/useResponsive';
import { calculateRefundPenalty } from 'services/train/refund';
import { useTrainRefundPath } from '../hooks';
import { Loader } from './Loader';
import { TComponentProps } from '.';

import styles from '../Refund.module.scss';

export const PaymentDetails: FC<TComponentProps> = ({ setAllowSubmit }) => {
  const { isMobile } = useResponsive();

  const { orderId, trainId, ticketIds, push } = useTrainRefundPath();

  const { data, error, isFetching, isError, refetch } = useQuery(
    ['train-calculate-refund', orderId, trainId, ticketIds],
    () => ticketIds && calculateRefundPenalty(orderId, trainId, ticketIds),
    {
      onSuccess: () => {
        setAllowSubmit(true);
      },
      retry: false,
    },
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    push({ isResultPage: true });

    setAllowSubmit(false);
  };

  return (
    <Loader {...{ isFetching, isError, error, refetch }}>
      <form id="train-refund" onSubmit={onSubmit} className="w-100">
        {isMobile ? (
          <>
            {data?.tickets?.map(({ id, passenger, totalPrice, penaltyAmount, refundAmount }) => (
              <div key={id} className="w-100 card border-0 shadow-sm mt-3">
                <div
                  className={
                    'bg-color-surface-container-low color-on-surface-var w-100 py-3 rounded-top text-end px-3'
                  }
                >
                  <Passenger />
                  <b className="pe-2">
                    {passenger?.firstName || passenger?.englishFirstName}{' '}
                    {passenger?.lastName || passenger?.englishLastName}
                  </b>
                </div>
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span> مبلغ بلیط</span>
                  <span>{Number(totalPrice).toLocaleString()} ریال</span>
                </div>

                <div className="d-flex justify-content-between px-3 pt-3">
                  <span> مبلغ جریمه</span>
                  <span>{Number(penaltyAmount).toLocaleString()} ریال</span>
                </div>
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span> مبلغ قابل استرداد</span>
                  <span className="color-primary pb-3">
                    <b>{Number(refundAmount).toLocaleString()} ریال </b>
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <table className={cn(styles.refund__modal__table, 'bg-color-surface-container w-100')}>
              <tr
                className={cn(
                  styles.refund__modal__table__items__font,
                  'bg-color-surface-container-low color-on-surface-var w-100',
                )}
              >
                <th
                  className={cn(
                    styles['refund__modal__table__items__radius-right'],
                    'text-center p-3',
                  )}
                >
                  نام و نام خانوادگی
                </th>
                <th className="text-center">مبلغ بلیط</th>
                <th className="text-center">مبلغ جریمه</th>
                <th className="text-center">مبلغ قابل استرداد</th>
              </tr>
              {data?.tickets?.map(({ id, passenger, totalPrice, penaltyAmount, refundAmount }) => (
                <tr key={id}>
                  <td className="text-center py-3">
                    <b>
                      {passenger?.firstName || passenger?.englishFirstName}{' '}
                      {passenger?.lastName || passenger?.englishLastName}
                    </b>
                  </td>
                  <td className="text-center">
                    <b>{Number(totalPrice).toLocaleString()} ریال</b>
                  </td>
                  <td className="text-center">
                    <b>{Number(penaltyAmount).toLocaleString()} ریال</b>
                  </td>
                  <td className="text-center color-primary">
                    <span className="color-primary">
                      <b>{Number(refundAmount).toLocaleString()} ریال </b>
                    </span>
                  </td>
                </tr>
              ))}
            </table>
          </>
        )}
      </form>
    </Loader>
  );
};
