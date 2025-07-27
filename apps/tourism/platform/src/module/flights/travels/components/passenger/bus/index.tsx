import cn from 'classnames';
import Divider from 'components/divider';
import { numberInPersian } from 'module/bus/checkout/utils';
import { getBusRefundStatus } from 'module/flights/travels/helper/travelHelper';
import React from 'react';

import { TBusPassengers, TBusRefund } from 'services/trips/types';
import TravelPassenger from '..';
import styles from '../../../travels.module.scss';
type BusPassengerProps = {
  arrivalCity?: string;
  departureCity?: string;
  seats: Array<number> | undefined;
  passengers: TBusPassengers;
  price: number | undefined;
  refund: TBusRefund;
};

const BusPassenger = ({
  departureCity,
  arrivalCity,
  passengers,
  seats,
  price,
  refund,
}: BusPassengerProps) => {
  return (
    <>
      <div className="d-md-none">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          title={'مسافران'}
          passengersCount={seats!.length}
        >
          <div className={cn('pb-3')}>
            <div className="d-flex justify-content-between">
              <div>
                <span className="text-weight-500 text-4">
                  <b>{passengers?.leaderName}</b>
                </span>
              </div>
              <div>
                {refund?.refundStatus && refund?.refundStatus !== 'REFUND_STATUS_UNDEFINED' && (
                  <span
                    className={cn(
                      (refund?.refundStatus === 'REFUND_STATUS_REJECTED' ||
                        refund?.refundStatus === 'REFUND_STATUS_FAILED') &&
                        'text-danger',
                      refund?.refundStatus === 'REFUND_STATUS_SUCCESSFUL' && 'text-success',
                    )}
                  >
                    {getBusRefundStatus(refund?.refundStatus)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface-var">
              <div> شماره صندلی:</div>
              <div>{seats} </div>
            </div>
            <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface-var">
              <div> مجموع قیمت: </div>
              <div>{(price! * (seats ? seats?.length : 1)).toLocaleString()} ریال</div>
            </div>
            {refund && refund?.refundStatus !== 'REFUND_STATUS_UNDEFINED' && (
              <>
                <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface-var">
                  <div>مبلغ جریمه</div>
                  <div>{Number(refund?.refundPenalty).toLocaleString()} ریال</div>
                </div>
                <div className="mt-3 d-flex justify-content-between align-item-center color-on-surface-var">
                  <div>
                    <span className="color-primary">مبلغ استرداد شده</span>
                  </div>
                  <div>
                    <span className="color-primary">
                      <b>{Number(refund?.refundAmount).toLocaleString()}</b> ریال
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/*<Divider type="horizontal" />*/}

          {/*{React.Children.toArray(*/}
          {/*  passengers?.nationalCode?.map((nationalCode, index) => (*/}
          {/*    <div*/}
          {/*      key={index.toString() + "bus"}*/}
          {/*      className="mt-3 d-flex justify-content-between align-item-center"*/}
          {/*    >*/}
          {/*      <div className="color-grey-1">*/}
          {/*        مسافر {numberInPersian[index]}{' '}*/}
          {/*      </div>*/}
          {/*      <div>*/}
          {/*        <b>{nationalCode}</b>{' '}*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  )),*/}
          {/*)}*/}
        </TravelPassenger>
      </div>

      <div className="d-none d-md-block">
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          passengersCount={seats!.length}
        >
          <table className="text-center">
            <thead>
              <tr
                className={cn(
                  styles['travels-container__content__items__font'],
                  'bg-color-surface-container color-on-surface',
                )}
              >
                <th
                  className={cn(
                    styles['travels-container__content__items__radius-right'],
                    'text-center py-3',
                  )}
                >
                  سرپرست مسافران
                </th>
                <th className="py-3"> مبلغ بلیط </th>
                <th>تعداد صندلی</th>
                <th> مبلغ کل</th>
                <th> وضعیت استرداد</th>
                <th> مبلغ جریمه</th>
                <th> مبلغ استرداد</th>
              </tr>
            </thead>
            <tbody className="bg-color-surface-container-low rounded-bottom">
              <tr className="color-on-surface-var">
                <td className="py-3">
                  {<span className="colors-grey-3">{passengers.leaderName}</span>}
                </td>
                <td>{price!.toLocaleString()} ریال</td>
                <td>{seats?.length}</td>
                <td>{(price! * (seats ? seats?.length : 1)).toLocaleString()} ریال</td>
                <td>
                  {refund?.refundStatus && (
                    // refund?.refundStatus !== 'REFUND_STATUS_UNDEFINED' && (
                    <span
                      className={cn(
                        (refund?.refundStatus === 'REFUND_STATUS_REJECTED' ||
                          refund?.refundStatus === 'REFUND_STATUS_FAILED') &&
                          'text-danger',
                        refund?.refundStatus === 'REFUND_STATUS_SUCCESSFUL' && 'text-success',
                      )}
                    >
                      {getBusRefundStatus(refund?.refundStatus)}
                    </span>
                  )}
                </td>
                <td>
                  {Number(refund?.refundPenalty) > 0 ? (
                    <span>{Number(refund?.refundPenalty).toLocaleString()} ریال</span>
                  ) : (
                    '-'
                  )}
                </td>

                <td>
                  {Number(refund?.refundAmount) > 0 ? (
                    <span>{Number(refund?.refundAmount).toLocaleString()} ریال</span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </TravelPassenger>
        <Divider type="horizontal" />
        <TravelPassenger
          arrivalCity={arrivalCity}
          departureCity={departureCity}
          title="کد ملی مسافران"
          passengersCount={seats!.length}
        >
          <table className="text-center">
            <thead>
              <tr
                className={cn(
                  styles['travels-container__content__items__font'],
                  'bg-color-surface-container color-on-surface',
                )}
              >
                {React.Children.toArray(
                  passengers?.nationalCode?.map((_, index) => (
                    <th
                      key={index.toString() + 'passengerBus'}
                      className={cn(
                        index == 0 && styles['travels-container__content__items__radius-right'],
                        'text-center py-3',
                      )}
                    >
                      کدملی مسافر {numberInPersian[index]}{' '}
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody className="bg-color-surface-container-low rounded-bottom">
              <tr className="color-on-surface-var">
                {React.Children.toArray(
                  passengers?.nationalCode?.map((nationalCode, index) => (
                    <th
                      key={index.toString() + nationalCode + 'Bus'}
                      className={cn('text-center py-3')}
                    >
                      <span>{nationalCode}</span>
                    </th>
                  )),
                )}
              </tr>
            </tbody>
          </table>
        </TravelPassenger>
      </div>
    </>
  );
};

export default BusPassenger;
