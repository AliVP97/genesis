import styles from './rooms.module.scss';
import cn from 'classnames';
import { THotelRooms, TRoom } from 'services/hotel/detail/interface';
import { persianCounter } from 'utils/helpers/persianCounter';
import { EditBlue, BackwardIcon } from 'assets/icons';
import { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { RoomsInfo } from './roomsInfo';
import Input from 'components/input';
import { useRouter } from 'next/router';
import Button from 'components/button';
import { definitions } from 'types/hotel';
import { hotelUpdateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import { DATE_UTILS } from 'utils/helpers/dateUtils';
import { HotelNotFound } from 'assets/images';
export type TSelectedRoom = {
  [key: string]: TRoom[] | undefined;
};

type TCity = definitions['apihotelCity'];
const Rooms = ({
  hotelRooms,
  city,
  hotelRoomsLoading,
  setSelectedRooms,
  selectedRooms,
}: {
  hotelRooms: THotelRooms;
  city: TCity;
  hotelRoomsLoading: boolean;
  selectedRooms: TSelectedRoom;
  setSelectedRooms: Dispatch<React.SetStateAction<TSelectedRoom | undefined>>;
}) => {
  const router = useRouter();
  const searchInfo = router?.query?.rooms;
  const roomsInfo = (searchInfo as string)?.split('-').map((room: string) => ({
    Adult: room?.split(',').length,
    Child: room?.includes('CHILD') ? room?.split('+CHILD_')?.length : 0,
  }));
  const hotelInfo = JSON.parse(String(localStorage.getItem('hotel_last_search')));
  const [visibleModal, setVisibleModal] = useState(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [rooms, setRooms] = useState<TRoom[] | undefined>();
  const isModal = (searchInfo as string)?.split('-').length > 1;
  useEffect(() => {
    if (!isModal && hotelRooms) {
      setRooms(
        hotelRooms?.rooms?.filter((item) => {
          if (item?.group?.groupIds?.some((groupId) => groupId === 0)) {
            return item;
          }
        }),
      );
    }
  }, [isModal, hotelRooms]);
  const platform = useRef<string | null>(null);
  useEffect(() => {
    platform.current = sessionStorage.getItem('platform');
  }, []);
  const handleChange = (index: number) => {
    setRooms(() => {
      return hotelRooms?.rooms?.filter((item) => {
        if (item?.group?.groupIds?.some((groupId) => groupId === index)) {
          return item;
        }
      });
    });
    setVisibleModal(true);
    setStartIndex(index);
  };
  const handleBack = () => {
    router.push('/hotel');
  };
  const handleBackAndSearch = () => {
    const lastSearch = hotelInfo[0];
    lastSearch.origin.city = city.name as string;
    lastSearch.origin.value = city.cityId as string;
    lastSearch.origin.type.id = 'city';
    lastSearch.origin.type.title = 'شهر';
    hotelUpdateLastSearchStorage(lastSearch);
    sessionStorage.setItem('searchHotel', 'autoSearch');
    router.push('/hotel?readCache=true');
  };
  const passengersCount = useMemo(() => {
    const amount = {
      total: hotelInfo?.[0]?.passenger.length,
      adult: 0,
      child: 0,
    };
    hotelInfo[0]?.passenger.forEach((item: { adult: number; child: [] }) => {
      amount.adult += item.adult;
      amount.child += item.child.length;
    });
    return amount;
  }, []);

  const shouldGoToNextRoom = useRef(false);
  const isSelectedRoomFlowDone = useRef(false);
  useEffect(() => {
    if (selectedRooms) {
      if (startIndex === 0) {
        shouldGoToNextRoom.current = true;
      }
      if (hotelInfo[0].passenger.length === startIndex + 1) {
        shouldGoToNextRoom.current = false;
      }
      if (
        selectedRooms[0] !== undefined &&
        hotelInfo[0].passenger.length > startIndex + 1 &&
        shouldGoToNextRoom.current &&
        selectedRooms[startIndex + 1] === undefined &&
        !isSelectedRoomFlowDone.current
      ) {
        handleChange(startIndex + 1);
      } else if (!shouldGoToNextRoom.current && !isSelectedRoomFlowDone.current) {
        setVisibleModal(false);
        isSelectedRoomFlowDone.current = true;
      }
    }
  }, [selectedRooms]);
  const chooseRoomLabel = (room: { [key: string]: number }, index: number) => {
    const element = (
      <>
        انتخاب اتاق {persianCounter(index)}{' '}
        <span className="color-primary">
          ( {room.Adult} بزرگسال {room.Child ? ` و ${room.Child} کودک )` : ')'}
        </span>
      </>
    );
    return element;
  };
  return (
    <div
      style={
        platform.current === 'superapp' ? { paddingBottom: '196px' } : { paddingBottom: '126px' }
      }
    >
      {hotelRooms?.rooms && hotelRooms?.rooms?.length > 0 ? (
        <>
          <div
            id="rooms_id"
            className={cn(styles['header'], 'text-weight-500 p-2 text-3 color-primary')}
          >
            <div className="d-flex flex-row flex-row-reverse pb-1 ltr">
              <span>
                {DATE_UTILS.formatDate(hotelInfo?.[0]?.departureDate as unknown as number, {
                  lang: 'fa',
                  showWeekDay: true,
                  showYear: false,
                })}
              </span>
              <span className="mx-1"> {'-'} </span>
              <span>
                {'  '}
                {DATE_UTILS.formatDate(hotelInfo?.[0]?.returningDate as unknown as number, {
                  lang: 'fa',
                  showWeekDay: true,
                  showYear: false,
                })}
              </span>
              <span dir="rtl">{` (${hotelRooms?.nights} شب) `}</span>
              <div role="button" className="pe-1" onClick={handleBack}>
                <EditBlue />
              </div>
            </div>
            <div className="rtl">
              {`${passengersCount.total} اتاق (${passengersCount.adult} بزرگسال${
                passengersCount.child > 0 ? ` - ${passengersCount.child} کودک` : ''
              })`}
            </div>
          </div>
          <>
            {isModal
              ? roomsInfo?.map((room: { [key: string]: number }, index: number) => {
                  return (
                    <div key={index.toString() + 'hotelRooms'} onClick={() => handleChange(index)}>
                      <Input
                        readOnly={true}
                        label={chooseRoomLabel(room, index)}
                        clearInput={() => false}
                        isError={false}
                        showCloseIcon={false}
                        // closeIcon={() => {
                        //   closeIconHandler(index);
                        // }}
                        field={{
                          value: selectedRooms?.[String(index)]
                            ? String(selectedRooms?.[String(index)]?.[0]?.room?.roomInfo?.name)
                                .length > 42
                              ? String(
                                  selectedRooms?.[String(index)]?.[0]?.room?.roomInfo?.name,
                                ).slice(0, 42) + '...'
                              : String(selectedRooms?.[String(index)]?.[0]?.room?.roomInfo?.name)
                            : '',
                          name: '',
                        }}
                        suffix={<BackwardIcon />}
                        isFocused={false}
                      />
                    </div>
                  );
                })
              : null}
            <RoomsInfo
              hotelRooms={hotelRooms}
              roomNumber={startIndex}
              visibleModal={visibleModal}
              setVisibleModal={setVisibleModal}
              nights={hotelRooms?.nights as number}
              rooms={rooms}
              setRooms={setRooms}
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
              startIndex={startIndex}
              roomsInfo={roomsInfo}
              isModal={isModal}
            />
          </>
        </>
      ) : null}

      {!hotelRoomsLoading && hotelRooms?.rooms?.length === 0 ? (
        <div className={styles['fullCapacity']}>
          <div className={styles['fullCapacity__btns']}>
            <HotelNotFound />

            <p className="color-grey-19">
              متاسفانه هتل درخواستی ظرفیت مورد نظر شما در تاریخ جستجو شده را ندارد، آیا تمایل به
              مشاهده ظرفیت در هتل های مشابه دارید ؟
            </p>
            <Button
              radius
              onClick={handleBackAndSearch}
              className={cn(styles['fullCapacity__btns--btn'], 'btn btn-primary w-100')}
            >
              مشاهده سایر هتل ها
            </Button>
            {/* <Button
              onClick={handleBack}
              className={cn(
                styles['fullCapacity__btns--btn'],
                'btn btn-primary',
              )}
            >
              {' '}
              بازگشت
            </Button> */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Rooms;
