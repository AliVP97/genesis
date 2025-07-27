import { FC } from 'react';
import cn from 'classnames';

import {
  getCompartmentTotalPrice,
  getPassengerTotalPrice,
  showOptionalServices,
  tariff2AgeType,
} from 'module/train/checkout/helper';
import { TrainOrder } from 'services/train/orders/interface';
import { definitions } from 'types/rajatrain';

import { FactorIcon } from 'assets/icons';
import styles from '../../../../styles/invoice.module.scss';

type DesktopFacorDetailsProps = {
  order: TrainOrder;
};

const Row: FC<
  Record<'departureTicket' | 'returnTicket', definitions['rajaTrainTicket'] | undefined> & {
    totalPrice?: string;
  }
> = ({ departureTicket, returnTicket, totalPrice }) => {
  const data = {
    name: departureTicket?.passenger?.isForeign
      ? `${departureTicket?.passenger?.englishFirstName} ${departureTicket?.passenger?.englishLastName}`
      : `${departureTicket?.passenger?.firstName} ${departureTicket?.passenger?.lastName}`,
    ageType: departureTicket?.tariff && tariff2AgeType[departureTicket?.tariff],
    price: Number(departureTicket?.price).toLocaleString(),
    returnPrice: Number(returnTicket?.price).toLocaleString() ?? '-',
    optionPrice: Number(departureTicket?.option?.[0]?.price).toLocaleString() ?? '-',
    returnOptionPrice: Number(returnTicket?.option?.[0]?.price).toLocaleString() ?? '-',
    options: showOptionalServices(departureTicket),
    returnOptions: showOptionalServices(returnTicket),
  };

  return (
    <tr>
      <td>{data.name}</td>
      <td>{data.ageType}</td>
      <td>
        {data.price} <span className="text-2">ریال</span>
      </td>
      <td>
        {returnTicket ? (
          <>
            {data.returnPrice}
            <span className="text-2">ریال</span>
          </>
        ) : (
          '-'
        )}
      </td>
      <td>
        {departureTicket?.option?.[0]?.name ? (
          <>
            {data.optionPrice}
            <span className="text-2">ریال</span>
          </>
        ) : (
          '-'
        )}
      </td>
      <td>
        {returnTicket?.option?.[0]?.price ? (
          <>
            {data.returnOptionPrice}
            <span className="text-2 me-1">ریال</span>
          </>
        ) : (
          '-'
        )}
      </td>
      <td>{data.options}</td>
      <td>{data.returnOptions}</td>
      <td>
        <span className="color-primary">
          <b>{totalPrice}</b>
          <span className="text-2 me-1">ریال</span>
        </span>
      </td>
    </tr>
  );
};

const DesktopFacorDetails = ({ order }: DesktopFacorDetailsProps) => {
  return (
    <>
      <div className={cn(styles['invoice__table__header--details'], 'mt-3 py-3 pe-3')}>
        <FactorIcon />
        <span className="pe-2">جزئیات فاکتور</span>
      </div>
      <div className="px-5">
        <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
          <thead>
            <tr
              className={cn(
                styles['invoice__inside-table__header'],
                'w-100 m-0 color-grey-1 text-center ',
              )}
            >
              <th>
                <span>نام و نام خانوادگی مسافر </span>
              </th>
              <th>
                <span> نوع مسافر</span>
              </th>
              <th>
                <span>رفت</span>
              </th>
              <th>
                <span>برگشت</span>
              </th>
              <th>
                <span>مبلغ خدمات رفت</span>
              </th>
              <th>
                <span>مبلغ خدمات برگشت</span>
              </th>
              <th>
                <span>خدمات قطار رفت</span>
              </th>
              <th>
                <span>خدمات قطار برگشت</span>
              </th>
              <th>
                <span className="color-primary">مجموع قیمت</span>
              </th>
            </tr>
          </thead>
          <tbody className={cn(styles['invoice__table__body'])}>
            {order.trips?.[0]?.tickets?.map((ticket, ticketIndex) => (
              <Row
                key={ticketIndex}
                departureTicket={ticket}
                returnTicket={order?.trips?.[1]?.tickets?.[ticketIndex]}
                totalPrice={getPassengerTotalPrice(order, ticket, ticketIndex)}
              />
            ))}
            {!!order.trips?.find((trip) =>
              trip.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'),
            ) && (
              <tr>
                <td>کوپه در بست</td>
                <td>-</td>
                <td>
                  <>
                    <div>
                      {order.trips?.[0].trainInfo?.priceDetail?.find(
                        (item) => item.tariff === 'TARIFF_EMPTY',
                      ) ? (
                        <>
                          {Number(
                            order.trips?.[0].trainInfo?.priceDetail?.find(
                              (item) => item.tariff === 'TARIFF_EMPTY',
                            )?.totalPrice,
                          ).toLocaleString()}{' '}
                          <span className="text-2 me-1">ریال</span>
                        </>
                      ) : (
                        <>-</>
                      )}
                    </div>

                    <div className="text-geray-2">
                      <small>
                        (
                        {
                          order.trips?.[0].trainInfo?.priceDetail?.find(
                            (item) => item.tariff === 'TARIFF_EMPTY',
                          )?.count
                        }
                        صندلی خالی )
                      </small>
                    </div>
                  </>
                </td>
                <td>
                  {order.trips?.[1]?.trainInfo?.priceDetail?.find(
                    (item) => item.tariff === 'TARIFF_EMPTY',
                  ) ? (
                    <>
                      <div>
                        {Number(
                          order.trips?.[1].trainInfo?.priceDetail?.find(
                            (item) => item.tariff === 'TARIFF_EMPTY',
                          )?.totalPrice,
                        ).toLocaleString()}{' '}
                        <span className="text-2 me-1">ریال</span>
                      </div>

                      <div className="text-geray-2">
                        <small>
                          (
                          {
                            order.trips?.[1].trainInfo?.priceDetail?.find(
                              (item) => item.tariff === 'TARIFF_EMPTY',
                            )?.count
                          }
                          صندلی خالی )
                        </small>
                      </div>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>
                  <span className="color-primary">
                    <b>{getCompartmentTotalPrice(order)}</b>

                    <span className="text-2 me-1">ریال</span>
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DesktopFacorDetails;
