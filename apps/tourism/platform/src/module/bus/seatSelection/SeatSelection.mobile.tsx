import { FC } from 'react';
import classNames from 'classnames';

import { SeatMapper } from './components';
import Button from 'components/button';
import Spinner from 'components/spinner';
import { TSeat } from 'services/bus/seats/interface';
import { BusInfo } from 'services/bus/tickets/interface';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BusSeatAvailable as BusSeatAvailableIcon,
  BusSeatBought as BusSeatBoughtIcon,
  BusSeatDriver,
  BusSeatReserved as BusSeatReservedIcon,
  InfoIcon,
} from 'assets/icons';
import style from './SeatSelection.module.scss';

type TSeatSelectionMobileProps = {
  isLoadingBusSeats: boolean;
  seatsMatrix: TSeat[][];
  toggleSeatSelection: (seat: TSeat) => void;
  selectedSeats: number[];
  showPriceDetails: boolean;
  selectedTicket?: BusInfo;
  setShowPriceDetails: (value: boolean) => void;
  handleSeatConfirm: () => void;
  isSubmiting: boolean;
};

export const SeatSelectionMobile: FC<TSeatSelectionMobileProps> = ({
  isLoadingBusSeats,
  seatsMatrix,
  toggleSeatSelection,
  selectedSeats,
  showPriceDetails,
  selectedTicket,
  setShowPriceDetails,
  handleSeatConfirm,
  isSubmiting,
}) => {
  return (
    <>
      <div className={style['seatSelection']}>
        <div className={style['seatSelection__info']}>
          <span className="text-2 text-weight-500">صندلی مسافران را انتخاب نمایید</span>
          <div className="d-flex text-weight-500 text-2 mt-3">
            <div className="flex-column d-flex align-items-center col-4">
              <BusSeatAvailableIcon className="mb-2" />
              قابل انتخاب
            </div>
            <div className="flex-column d-flex align-items-center col-4">
              <BusSeatReservedIcon className="mb-2" />
              رزرو شده
            </div>
            <div className="flex-column d-flex align-items-center col-4">
              <BusSeatBoughtIcon className="mb-2" />
              انتخاب شما
            </div>
          </div>
          <div className="text-2 color-grey-1 mt-3">
            <div className="d-flex">
              <InfoIcon className="fill-grey-1 mt-2 ms-2 col-1" />
              <div className="col-10  mb-3">
                جهت رزرو صندلی، لطفا برای هر مسافر، شماره صندلی‌های مورد نظر را در تصویر انتخاب
                نمایید.
              </div>
            </div>
            <div className="d-flex mb-3">
              <InfoIcon className="fill-grey-1 mt-2 ms-2 col-1" />
              <div className="col-10">
                کلیک دوباره روی هر کدام از صندلی‌ها، آن‌ها را از وضعیت انتخاب‌شده خارج می‌کند.
              </div>
            </div>
            <div className="d-flex">
              <InfoIcon className="fill-brown mt-2 ms-2 col-1" />
              <div className="col-10 color-brown">
                به دلایل قانونی, امکان رزرو ردیف اول توسط بانوان میسر نیست!
              </div>
            </div>
          </div>

          <div
            className={classNames(
              style['seatSelection__seats'],
              'ltr d-flex justify-content-center',
            )}
          >
            <div>
              {isLoadingBusSeats ? (
                <Spinner />
              ) : (
                <>
                  <div className="px-2">
                    <BusSeatDriver className="mt-3" width={48} height={48} />
                  </div>

                  {seatsMatrix.map((row, rowIndex) => {
                    return (
                      <div key={rowIndex.toString() + 'busSeatSelection'} className="d-flex py-2">
                        {row.map((column, colIndex) => (
                          <SeatMapper
                            key={colIndex.toString() + 'busSeatSelectionNested'}
                            data={column}
                            selectedSeats={selectedSeats}
                            toggleSeatSelection={toggleSeatSelection}
                            isMobile
                          />
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classNames(style['seatSelection__footer'], 'p-3')}>
        <div
          className={classNames(
            showPriceDetails
              ? style['seatSelection__footer--withPriceDetail']
              : style['seatSelection__footer--withoutPriceDetail'],
            'row',
          )}
        >
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3 m-1"> شماره صندلی‌های انتخاب شده</span>
            </div>

            <div
              dir="rtl"
              className="d-flex flex-row-reverse justify-content-start align-items-center"
            >
              {selectedSeats.length ? (
                selectedSeats.map((seat, index, seats) => (
                  <span className="color-grey-1" key={seat.toString() + 'busSeat'}>
                    {index !== seats.length - 1 && <span>،</span>}
                    {seat}
                  </span>
                ))
              ) : (
                <span className="color-grey-1">-</span>
              )}
            </div>
          </div>
          <div className={style['seatSelection__footer__divider']} />

          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3 m-1">قیمت هر صندلی </span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1">
                x {selectedSeats.length}
              </span>
              <span className="color-grey-1">
                {Number(selectedTicket?.price).toLocaleString()}
                <span className="text-2 me-2">ریال</span>
              </span>
            </div>
          </div>
          <div className={style['seatSelection__footer__divider']} />
        </div>

        <div
          onClick={() => setShowPriceDetails(!showPriceDetails)}
          className={style['seatSelection__footer__history']}
        >
          <div className="d-flex flex-row-reverse mt-2">
            <div className="col text-end text-3">
              {showPriceDetails ? (
                <>
                  {' '}
                  <ArrowDownIcon />
                  مجموع قیمت برای {selectedSeats.length} نفر{' '}
                </>
              ) : (
                <>
                  <ArrowUpIcon />
                  مجموع قیمت
                </>
              )}
            </div>
            <div dir="rtl" className="color-primary col text-start">
              <span className="text-5 text-weight-500">
                {(Number(selectedTicket?.price) * selectedSeats.length).toLocaleString()}{' '}
              </span>
              <span className="text-3 me-1">ریال</span>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <Button
            className={classNames(
              style['seatSelection__footer__btn'],
              'btn btn-primary',
              'justify-content-center d-flex align-items-center text-weight-500',
            )}
            onClick={handleSeatConfirm}
            loading={isSubmiting}
            disabled={selectedSeats.length == 0}
          >
            تایید و ادامه
          </Button>
        </div>
      </div>
    </>
  );
};
