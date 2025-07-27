import { BusSeatAvailable, BusSeatDriver, BusSeatReserved } from 'assets/icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSeats } from '../../../hooks';
import { useGetBusSeatsMatrix } from '../../hooks/useGetBusSeatsMatrix';
import style from './style.module.scss';
import { BusSeatsResponse } from 'services/bus/seats/interface';
import Skeleton from 'components/skeleton';
import { BusInfo } from 'services/bus/tickets/interface';

interface Props {
  ticket: BusInfo;
  isDesktop?: boolean;
  openedDetailId?: string;
}
const SeatsDetail = ({ ticket, isDesktop, openedDetailId }: Props) => {
  const [enable, setEnable] = useState(false);
  const { data: busSeatsData, isLoading: isLoadingBusSeats } = useSeats(ticket?.busId, {
    enabled: enable,
  });
  const { seatsMatrix } = useGetBusSeatsMatrix(busSeatsData as BusSeatsResponse);

  useEffect(() => {
    if (ticket?.busId && (!isDesktop || ticket?.busId === openedDetailId)) {
      setEnable(true);
    }
  }, [ticket?.busId, openedDetailId]);

  return (
    <div className="col-sm d-flex">
      <div className="col-7">
        {isLoadingBusSeats ? (
          <Skeleton uniqueKey="busSeats" type="busSeats" height="100%" width="100%" />
        ) : (
          <>
            <div className={classNames(style['seats'], 'ltr')}>
              <BusSeatDriver />

              {seatsMatrix.map((row, rowIndex) => {
                return (
                  <div key={rowIndex.toString() + 'seatDetailBus'} className="d-flex">
                    {row.map((column, colIndex) => (
                      <div
                        className="px-2"
                        style={{ width: '30px' }}
                        key={colIndex.toString() + 'busTicket'}
                      >
                        {column.availability == 'SEAT_AVAILABLE' && column.seatNumber != 0 ? (
                          <BusSeatAvailable width={20} height={20} />
                        ) : (column.availability == 'SEAT_UNAVAILABLE_WOMAN' ||
                            column.availability == 'SEAT_UNAVAILABLE_MAN' ||
                            column.availability == 'SEAT_UNAVAILABLE_EMPTY') &&
                          column.seatNumber != 0 ? (
                          <BusSeatReserved width={20} height={20} />
                        ) : (
                          ''
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className={classNames('col-5 pt-4', !isDesktop && 'rtl')}>
        <div className={classNames('d-flex align-items-center', !isDesktop && 'me-4')}>
          <BusSeatAvailable /> <div className="me-1 text-3">قابل انتخاب</div>
        </div>
        <div className={classNames('d-flex align-items-center pt-2', !isDesktop && 'me-4')}>
          <BusSeatReserved /> <div className="me-1 text-3"> رزرو شده</div>
        </div>
      </div>
    </div>
  );
};
export default SeatsDetail;
