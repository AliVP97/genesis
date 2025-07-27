import { BackArrowIcon, DownArrow, UpArrow, UserIcon } from 'assets/icons';
import cn from 'classnames';
import Button from 'components/button';
import Modal from 'components/modal';
import _ from 'lodash';
import { Dispatch, SetStateAction, useState } from 'react';
import { THotelRooms, TRoom } from 'services/hotel/detail/interface';
import { persianCounter } from 'utils/helpers/persianCounter';
import { notify } from 'utils/notification';
import { TSelectedRoom } from '..';
import styles from '../rooms.module.scss';
import { Explanation } from '../../explanation';

export type TRoomsModal = {
  hotelRooms: THotelRooms;
  nights: number;
  visibleModal: boolean;
  setVisibleModal: Dispatch<boolean>;
  selectedRooms: TSelectedRoom | undefined;
  setSelectedRooms: Dispatch<SetStateAction<TSelectedRoom | undefined>>;
  roomNumber: number;
  rooms: TRoom[] | undefined;
  setRooms: Dispatch<SetStateAction<TRoom[] | undefined>>;
  startIndex: number;
  roomsInfo: Array<{ [key: string]: number }>;
  isModal: boolean;
};
export const RoomsInfo = ({
  visibleModal,
  setVisibleModal,
  nights,
  selectedRooms,
  setSelectedRooms,
  roomNumber,
  rooms,
  roomsInfo,
  isModal,
}: TRoomsModal) => {
  const [visibleExplanation, setVisibleExplanation] = useState(false);
  const [roomInfo, setRoomInfo] = useState<TRoom>();
  const handleExplanation = (item: TRoom) => {
    setRoomInfo(item);
    setVisibleExplanation(!visibleExplanation);
  };

  const handleClick = (item: TRoom, rooms: TRoom[]) => {
    if (
      Number(item.room?.roomInfo?.quantity) === 0 &&
      selectedRooms?.[String(roomNumber)]?.[0]?.room?.roomId !== item?.room?.roomId
    )
      notify({ type: 'info', message: 'اتاق ظرفیت ندارد' });
    else {
      if (selectedRooms?.[String(roomNumber)]?.[0].room?.roomId === item.room?.roomId) {
        item!.room!.roomInfo!.quantity = Number(item?.room?.roomInfo?.quantity) + 1;
        setSelectedRooms((prev) => {
          const state = { ...prev };
          state[String(roomNumber)] = undefined;

          return state;
        });
      } else {
        if (item.room?.roomInfo) {
          rooms.forEach((item) => {
            if (item.room?.roomId === selectedRooms?.[String(roomNumber)]?.[0].room?.roomId) {
              item!.room!.roomInfo!.quantity = Number(item?.room?.roomInfo?.quantity) + 1;
            }
          });
          item!.room!.roomInfo!.quantity = Number(item?.room?.roomInfo?.quantity) - 1;
        }
        setSelectedRooms((prev) => {
          return {
            ...prev,
            [String(roomNumber)]: [item],
          };
        });
        setVisibleModal(false);
      }
    }
    // setVisibleModal(false);
  };
  const roomsEl = (
    <>
      {rooms?.map((item) => {
        const isSelected = !_.isEmpty(selectedRooms)
          ? selectedRooms?.[String(roomNumber)]?.some(
              (selectedRoom) => selectedRoom?.room?.roomId === item.room?.roomId,
            )
          : false;
        const hasExtraBed = !!item?.room?.roomInfo?.hasExtraBed;
        return (
          <>
            <div
              className={cn(
                isSelected ? styles['pkg__room__selected'] : styles['pkg__room'],
                'd-flex flex-column my-2 p-3',
              )}
            >
              <div className={cn(styles['pkg__room__first-content'], 'd-flex flex-column')}>
                <div className="d-flex flex-row-reverse justify-content-between">
                  <div className="d-flex flex-row-reverse pb-3">
                    <span className="text-3 text-weight-500">{item.room?.roomInfo?.name}</span>
                  </div>
                  <div className="d-flex flex-row-reverse text-2 align-items-start">
                    <UserIcon className={cn(styles['pkg__room__first-content__icon'])} />
                    <span className="pt-1">{item?.room?.roomInfo?.capacity}</span>
                    <span className="pt-1 pe-1">نفر</span>
                    {hasExtraBed ? (
                      <>
                        {' '}
                        <span className="pt-1">1 +</span>
                        <span className="pt-1 pe-1">نفر اضافه</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="d-flex flex-row-reverse pb-3 gap-1">
                  <div className="d-flex gap-1 flex-row-reverse">
                    {!item.room?.roomInfo?.refundable ? (
                      <div className={styles['pkg__room__refundable']}>غیر قابل استرداد </div>
                    ) : (
                      <></>
                    )}
                    {item.room?.roomInfo?.temporaryStay ? (
                      <div className={styles['pkg__room__refundable']}>اقامت موقت</div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {item.room?.roomInfo?.tagList?.length
                    ? item.room?.roomInfo?.tagList.map((tag: string, index: number) => (
                        <div
                          key={`tag-${index}`}
                          className={cn(
                            styles['pkg__room__first-content__with-option'],
                            'text-2 pt-1 text-center',
                          )}
                        >
                          {tag}
                        </div>
                      ))
                    : null}
                </div>
              </div>
              <div
                className={cn(
                  styles['pkg__room__second-content'],
                  'd-flex flex-column py-2 text-3',
                )}
              >
                {item?.room?.priceDetail?.price?.discountPercent &&
                  Number(item?.room?.priceDetail?.price?.discountPercent) > 0 && (
                    <div className="d-flex flex-row-reverse justify-content-between pb-2">
                      <div
                        className={cn(styles['pkg__room__second-content__discount'], 'color-white')}
                      >
                        <div className="d-flex flex-row-reverse justify-content-evenly align-items-center text-2">
                          <span>{item?.room?.priceDetail?.price?.discountPercent}٪</span>{' '}
                          <span>تخفیف</span>
                        </div>
                      </div>
                      <del className="text-weight-500 d-flex flex-row text-2 color-grey-24">
                        <span>ریال</span>
                        <span className="ps-1">
                          {item?.room.priceDetail?.price?.totalPrice?.toLocaleString()}
                        </span>
                      </del>
                    </div>
                  )}
                <div className="d-flex flex-row-reverse justify-content-between">
                  <div>{` قیمت برای ${nights} شب`}</div>
                  <div className="text-weight-500 d-flex flex-row color-primary">
                    <span>ریال</span>
                    <span className="ps-1">
                      {item?.room?.priceDetail?.price?.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row-reverse justify-content-between align-items-center">
                {item?.room?.roomInfo?.description ? (
                  <div className="text-2" onClick={() => handleExplanation(item)}>
                    {visibleExplanation && item?.room?.roomId === roomInfo?.room?.roomId ? (
                      <UpArrow />
                    ) : (
                      <DownArrow />
                    )}

                    <span className="ps-1 color-primary">توضیحات اتاق ها</span>
                  </div>
                ) : (
                  <div></div>
                )}
                <Button
                  className={cn(
                    isSelected ? styles['pkg__reserve-btn--selected'] : styles['pkg__reserve-btn'],
                    'bg-color-primary',
                  )}
                  onClick={() => handleClick(item, rooms)}
                  radius
                >
                  <span className="text-2">{isSelected ? 'حذف اتاق' : 'رزرو اتاق'}</span>
                </Button>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
  return (
    <>
      {isModal ? (
        <Modal
          className={styles['pkg__modal']}
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
        >
          <div className="w-100 h-100 bg-color-white px-3">
            <div
              className={cn(
                styles['pkg__modal__header'],
                'row  d-flex align-items-center px-3  sticky-top',
              )}
            >
              <div className="col-11 text-center">
                {` انتخاب اتاق ${persianCounter(roomNumber)} (${
                  roomsInfo[roomNumber].Adult
                } بزرگسال ${
                  roomsInfo[roomNumber].Child ? `${roomsInfo[roomNumber].Child} کودک ` : ''
                })`}
              </div>

              <div className="col-1" onClick={() => setVisibleModal(false)}>
                <BackArrowIcon className={cn('fill-tertiary')} />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between">
              <div className="me-0 ms-auto pt-3">نوع اتاق را انتخاب نمایید</div>
            </div>
            {roomsEl}
          </div>
        </Modal>
      ) : (
        <div className={styles['rooms_info__container']}>{roomsEl}</div>
      )}
      {visibleExplanation && (
        <Explanation
          visible={visibleExplanation}
          setVisible={setVisibleExplanation}
          roomInfo={roomInfo as TRoom}
        />
      )}
    </>
  );
};
