import cn from 'classnames';
import styles from 'module/hotel/detail/details.module.scss';
import Button from 'components/button';
import React from 'react';
import { THotelRooms, TRoomDetails } from 'services/hotel/detail/interface';
import Spinner from 'components/spinner';
interface IProps {
  allUndefined: boolean;
  sumTotalPriceRooms: number;
  dupHotelRooms: THotelRooms;
  allDefined: boolean;
  handleClick: () => void;
  createOrderIsLoading: boolean;
  hotelRoomsLoading?: boolean;
  memoizedNewArray: Array<{
    id: number;
    isSelected: boolean;
    selectedRoom?: TRoomDetails;
    person: { adult: string; child: Array<{ value: 'string' }> };
    sumPrice: number;
  }>;
}
export const SumOfRooms = (props: IProps) => {
  const {
    dupHotelRooms,
    sumTotalPriceRooms,
    allUndefined,
    memoizedNewArray,
    allDefined,
    handleClick,
    createOrderIsLoading,
    hotelRoomsLoading,
  } = props;
  return (
    <div className={`${styles['rooms__sumOfRooms']} col-3 p-0`}>
      {hotelRoomsLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '187px' }}
        >
          <Spinner />
        </div>
      ) : (
        <div
          className={`${styles['rooms__sumOfRooms']} bg-color-blue-light-4 p-3 card w-100 d-flex flex-column`}
        >
          <div
            className={cn(
              styles['rooms__price__finalPrice'],
              'd-flex flex-row-reverse justify-content-between  align-items-center pb-3 ',
            )}
          >
            <div className="text-weight-500 text-3 rtl ">
              {`مجموع قیمت برای ${dupHotelRooms?.nights} شب`}
            </div>
            <div className="d-flex align-items-center gap-1">
              <div className="text-primary text-weight-400 text-4">ریال</div>

              <div>
                <div className="text-primary text-weight-700 text-6 rtl">{` ${Number(
                  sumTotalPriceRooms,
                ).toLocaleString()} `}</div>
              </div>
            </div>
          </div>
          {allUndefined && <div className="text-center pt-3">هنوز هیچ اتاقی رزرو نشده است</div>}

          {memoizedNewArray.map((ele, index) => {
            return (
              <div
                key={index.toString() + 'sumOfRooms' + ele.id.toString()}
                className="d-flex flex-row justify-content-between pt-2"
              >
                <div className="text-weight-500 text-3 rtl">
                  {ele.selectedRoom?.priceDetail?.price &&
                    `${ele.selectedRoom?.priceDetail?.price?.totalPrice?.toLocaleString()} ریال`}
                </div>
                <div className="text-3 rtl">{ele.selectedRoom?.roomInfo?.name}</div>
              </div>
            );
          })}
          <div className="pt-3">
            <Button
              className="w-100 bg-color-primary  "
              btnType={'submit'}
              radius
              disabled={!allDefined}
              onClick={handleClick}
              loading={createOrderIsLoading}
            >
              تایید و ادامه خرید
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
