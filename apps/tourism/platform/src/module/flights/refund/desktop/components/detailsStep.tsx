import React from 'react';
import cn from 'classnames';
import styles from '../../refund.module.scss';
import { findUserInfoBaseOnTicketId } from '../../utils/tickets';
import { TDetailsStepProps } from '../types';
import { Passenger } from 'assets/icons';

export const DetailsStep: React.FunctionComponent<TDetailsStepProps> = ({
  calcRefundData,
  order,
}) => {
  return (
    <>
      <div className="rtl">
        <div className="d-md-none">
          {calcRefundData?.ticketsRefundInfo?.map((ticketInfo) => {
            const info = findUserInfoBaseOnTicketId(order.passengers!, ticketInfo.ticketId || '');
            return (
              <>
                <div className="w-100 card border-0 shadow-sm mt-3">
                  <div
                    className={cn(
                      'bg-color-surface-container-low color-on-surface-var w-100 py-3 rounded-top text-end px-3',
                    )}
                  >
                    <Passenger />
                    <b className="pe-2">
                      {(info?.passenger as { firstName: string }).firstName}{' '}
                      {(info?.passenger as { lastName: string }).lastName}{' '}
                    </b>
                  </div>
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span> مبلغ بلیط</span>
                    <span>
                      {Number(
                        (info?.ticket as { payment: { price: string } })?.payment?.price,
                      ).toLocaleString()}{' '}
                      ریال
                    </span>
                  </div>

                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span> مبلغ جریمه</span>
                    <span>{Number(ticketInfo.refundPenalty).toLocaleString()} ریال</span>
                  </div>
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span> مبلغ قابل استرداد</span>
                    <span className="color-primary pb-3">
                      <b>{Number(ticketInfo.refundAmount).toLocaleString()} ریال </b>
                    </span>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="d-none d-md-block">
          <table
            className={cn(styles.refund__modal__table, 'bg-color-surface-container w-100 my-2')}
          >
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
              <th></th>
              <th></th>
              <th></th>
              <th className={styles['refund__modal__table__items__radius-left']}></th>
            </tr>

            {calcRefundData?.ticketsRefundInfo?.map((ticketInfo) => {
              const info = findUserInfoBaseOnTicketId(order.passengers!, ticketInfo.ticketId || '');
              return (
                <tr key={ticketInfo.ticketId}>
                  <td className="text-center py-3">
                    <b>
                      {(info?.passenger as { firstName: string }).firstName}{' '}
                      {(info?.passenger as { lastName: string }).lastName}
                    </b>
                  </td>
                  <td className="text-center">
                    <b>
                      {Number(
                        (info?.ticket as { payment: { price: string } })?.payment?.price,
                      ).toLocaleString()}{' '}
                      ریال
                    </b>
                  </td>
                  <td className="text-center">
                    <b>{Number(ticketInfo.refundPenalty).toLocaleString()} ریال</b>
                  </td>
                  <td className="text-center color-primary">
                    <span className="color-primary">
                      <b>{Number(ticketInfo.refundAmount).toLocaleString()} ریال </b>
                    </span>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </>
  );
};
