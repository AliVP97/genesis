import classNames from 'classnames';
import router from 'next/router';

import { SeatMapper } from './components';
import Button from 'components/button';
import Spinner from '../../../components/spinner';
import SelectedTicket from '../tickets/components/selectedTicket';

import {
  BusSeatAvailable as BusSeatAvailableIcon,
  BusSeatBought as BusSeatBoughtIcon,
  BusSeatDriver,
  BusSeatReserved as BusSeatReservedIcon,
  BusSeatSelectionIcon,
  InfoIcon,
} from 'assets/icons';
import { BusInfo } from 'services/bus/tickets/interface';

import style from './SeatSelection.module.scss';
import { BusSeatsResponse, TSeat } from 'services/bus/seats/interface';
import { FC } from 'react';

type TSeatSelectionDesktopProps = {
  isLoadingBusSeats: boolean;
  seatsMatrix: TSeat[][];
  toggleSeatSelection: (seat: TSeat) => void;
  selectedSeats: number[];
  selectedTicket?: BusInfo;
  busSeatsData?: BusSeatsResponse;
  handleSeatConfirm: () => void;
  isSubmiting: boolean;
};

export const SeatSelectionDesktop: FC<TSeatSelectionDesktopProps> = ({
  isLoadingBusSeats,
  seatsMatrix,
  toggleSeatSelection,
  selectedSeats,
  selectedTicket,
  busSeatsData,
  handleSeatConfirm,
  isSubmiting,
}) => {
  return (
    <>
      <SelectedTicket />
      <div className={style['seatSelectionDesktop']}>
        <div className={style['seatSelectionDesktop__header']}>
          <BusSeatSelectionIcon className="fill-grey-1 ms-1" />
          <span className="pb-1">انتخاب صندلی</span>
        </div>
        <div className="rtl pt-3 me-5">
          <span className="text-4">صندلی مسافران را انتخاب نمایید</span>
        </div>
        <div className="d-flex">
          <div className="col-8 px-5 position-relative">
            <div className="d-flex text-weight-500 text-3 mt-5 rtl">
              <div className=" d-flex align-items-center col-2">
                <BusSeatAvailableIcon className="mb-2 ms-1" />
                قابل انتخاب
              </div>
              <div className=" d-flex align-items-center col-2">
                <BusSeatReservedIcon className="mb-2 ms-1" />
                رزرو شده
              </div>
              <div className=" d-flex align-items-center col-2">
                <BusSeatBoughtIcon className="mb-2 ms-1" />
                انتخاب شما
              </div>
            </div>
            <div className="text-3 color-grey-1 mt-3  rtl">
              <div className="d-flex align-items-center">
                <InfoIcon className="fill-grey-1  ms-2" />
                جهت رزرو صندلی، لطفا برای هر مسافر، شماره صندلی‌های مورد نظر را در تصویر انتخاب
                نمایید.
              </div>
              <div className="d-flex  align-items-center">
                <InfoIcon className="fill-grey-1  ms-2" />
                کلیک دوباره روی هر کدام از صندلی‌ها، آن‌ها را از وضعیت انتخاب‌شده خارج می‌کند.
              </div>
              <div className="d-flex align-items-center">
                <InfoIcon className="fill-brown  ms-2" />
                <div className=" color-brown">
                  به دلایل قانونی, امکان رزرو ردیف اول توسط بانوان میسر نیست!
                </div>
              </div>
            </div>
            <div className={style['seatSelectionDesktop__price']}>
              <div className={style['seatSelectionDesktop__price__header']}>
                <div className="mb-2">جزییات قیمت</div>
              </div>
              <div className={style['seatSelectionDesktop__price__content']}>
                <div className="d-flex px-4 ">
                  <div className="col-6  align-self-center">شماره صندلی‌های انتخاب شده</div>
                  <div className="col-6 d-flex flex-row-reverse justify-content-start align-items-center mt-3">
                    {selectedSeats.length ? (
                      selectedSeats.map((seat, index, seats) => (
                        <p
                          className="text-5 text-weight-500"
                          key={seat.toString() + 'seatSelection'}
                        >
                          {index !== seats.length - 1 && <span>،</span>}
                          {seat}
                        </p>
                      ))
                    ) : (
                      <p className="text-5 text-weight-500">-</p>
                    )}
                  </div>
                </div>
                <div className={style['seatSelectionDesktop__price__devider']} />
                <div className="d-flex px-4 ">
                  <div className="col-6  align-self-center">قیمت هر صندلی</div>
                  <div className="col-6 d-flex justify-content-end align-items-center mt-3">
                    <p className="ms-1 text-4 color-tertiary">x{selectedSeats.length}</p>
                    <p className="text-5 text-weight-500">
                      {Number(selectedTicket?.price).toLocaleString()}
                    </p>
                    <p className="text-2 me-1">ریال</p>
                  </div>
                </div>
                <div className={style['seatSelectionDesktop__price__devider']} />
                <div className="d-flex pt-3 px-4">
                  <div className="col-6 color-black">
                    مجموع قیمت برای {selectedSeats.length} نفر
                  </div>
                  <div className="col-6 d-flex justify-content-end align-items-center color-primary text-weight-500">
                    <p className="text-5">
                      {(Number(selectedTicket?.price) * selectedSeats.length).toLocaleString()}
                    </p>
                    <p className="text-2 me-1">ریال</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames(
              style['seatSelectionDesktop__content'],
              'col-4',
              busSeatsData?.busMap?.[0]?.row &&
                busSeatsData?.busMap?.[0]?.row <= 3 &&
                style['seatSelectionDesktop__content--car'],
            )}
          >
            {isLoadingBusSeats ? (
              <Spinner />
            ) : (
              <>
                <div
                  style={{ width: 'fit-content', margin: 'auto' }}
                  className={classNames(style['seatSelection__seats'], 'ltr')}
                >
                  <div className="ps-3 pe-4 ">
                    <BusSeatDriver className="mt-3" width={48} height={48} />
                  </div>
                  {seatsMatrix.map((row, rowIndex) => {
                    return (
                      <div key={rowIndex.toString() + 'busSelection'} className="d-flex">
                        {row.map((column, colIndex) => (
                          <SeatMapper
                            key={colIndex.toString() + 'busSeatSelectionNested'}
                            data={column}
                            selectedSeats={selectedSeats}
                            toggleSeatSelection={toggleSeatSelection}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={style['seatSelectionDesktop__footer']}>
        <div className="d-flex justify-content-end rtl">
          <Button
            btnType="submit"
            onClick={() => router.back()}
            className={classNames(
              style['seatSelectionDesktop__footer__btn'],
              'btn bg-white color-grey-1 mx-3',
            )}
            radius
          >
            بازگشت
          </Button>
          <Button
            className={classNames(
              style['seatSelectionDesktop__footer__btn'],
              'btn btn-primary border-0',
            )}
            onClick={handleSeatConfirm}
            loading={isSubmiting}
            disabled={selectedSeats.length == 0}
            radius
          >
            <div
              className="d-flex flex-row w-100 justify-content-center"
              style={{ width: '150px' }}
            >
              تایید و ادامه
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};
