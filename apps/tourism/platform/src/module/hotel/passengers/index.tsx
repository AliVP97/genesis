import style from './style.module.scss';
import { Device } from 'utils/interface';
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import Button from 'components/button';
import { cloneDeep } from 'lodash';

import { useQuery, useMutation } from 'react-query';
import { getOrder, hotelAddPassengersV2 } from 'services/hotel/rooms';
import router, { useRouter } from 'next/router';

import cn from 'classnames';
import { ArrowUpIcon } from 'assets/icons';
import { useRouteChange } from '../../../utils/hooks/useRouteChange';
import { definitions } from 'types/hotel';
import { notify } from 'utils/notification';
import usePassengersCount from '../hooks/usePassengersCount';
import { ArrowLeftPrimaryColor } from 'assets/icons';
import Divider from 'components/divider';
import Checkbox from 'components/checkbox';
import Modal from 'components/modal';
import Header from 'components/passenger/components/header';
import { AddLeaderCallBack } from 'components/passenger/components/passengersList';
import { HotelInfo } from './components/hotelInfo';
import superjson from 'superjson';
import Spinner from 'components/spinner';

type TErrorResponse = definitions['rpcStatus'];
type TProps = {
  device: Device;
};
const roomNumber: Record<number, string> = {
  1: 'اول',
  2: 'دوم',
  3: 'سوم',
  4: 'چهارم',
};
export type RoomsPassengers = {
  name?: string;
  capacity?: string;
  description?: string;
  leader?: { name: string; id: string };
  passengers?: { name?: string; id?: string }[];
  earlyCheckin?: { isAvailable?: boolean; isChecked?: boolean; price?: bigint };
  lateCheckout?: { isAvailable?: boolean; isChecked?: boolean; price?: bigint };
  extraBed?: {
    isAvailable?: boolean;
    isChecked?: boolean;
    price?: bigint;
    isMandatory?: boolean;
  };
  roomId?: string;
  passengerCount?: { count: number };
  roomePrice?: bigint;
  hasBreakfast?: boolean;
  refundable?: boolean;
}[];

const PassengerList = lazy(() => {
  return import('components/passenger/components/passengersList');
});

type AddPassengerRef = {
  showAddModal: (isVisible: boolean) => void;
};
const HotelPassengers = (props: TProps) => {
  const { query } = useRouter();
  const [roomsPassengers, setRoomsPassengers] = useState<RoomsPassengers>([]);

  const { data: orderData } = useQuery({
    queryFn: () => getOrder(query.orderId),
    staleTime: 0, // Data is always considered stale
    cacheTime: 0,
    queryKey: [query.orderId],
  });
  const passengersCount = usePassengersCount();

  useEffect(() => {
    const cachedData = localStorage.getItem('hotel_room_passenger');
    if (orderData && !totalPrice) {
      const price =
        orderData?.room?.reduce((totalPrice, room) => {
          let roomPrice = BigInt(room.priceDetail?.price?.totalPrice || 0);
          if (room.priceDetail?.extraBed?.mandatoryChecked) {
            roomPrice += BigInt(room.priceDetail?.extraBed?.price || 0);
          }
          return totalPrice + roomPrice;
        }, totalPrice) || BigInt(0);
      setTotalPrice(price);
      setTotalNights(query.nights);
    }
    if (roomsPassengers.length === 0 && cachedData && orderData) {
      try {
        const parsedCache: RoomsPassengers = superjson.parse(cachedData);

        const price =
          parsedCache?.reduce((totalPrice, room) => {
            let roomExtra = BigInt(0);
            if (room.earlyCheckin?.isChecked) {
              roomExtra += BigInt(room?.earlyCheckin?.price || 0);
            }
            if (room.lateCheckout?.isChecked) {
              roomExtra += BigInt(room?.lateCheckout?.price || 0);
            }
            if (room.extraBed?.isChecked && !room.extraBed?.isMandatory) {
              roomExtra += BigInt(room?.extraBed?.price || 0);
            }
            return totalPrice + roomExtra;
          }, totalPrice) || BigInt(0);
        setTotalPrice((total) => total + price);
        parsedCache && setRoomsPassengers(parsedCache as RoomsPassengers);
      } catch (err) {
        console.error(err);
      }
    } else if (roomsPassengers.length === 0 && orderData) {
      const roomsArr: RoomsPassengers = [];
      if (orderData?.room && passengersCount) {
        orderData.room.forEach((room, idx) => {
          roomsArr.push({
            name: room?.roomInfo?.name,
            capacity: room?.roomInfo?.capacity,
            description: room?.roomInfo?.description,
            leader: { name: '', id: '' },
            passengers: [],
            earlyCheckin: {
              isAvailable: !!room.priceDetail?.halfCharge?.early?.availability,
              isChecked: false,
              price: BigInt(room.priceDetail?.halfCharge?.early?.price || 0),
            },
            lateCheckout: {
              isAvailable: !!room.priceDetail?.halfCharge?.late?.availability,
              isChecked: false,
              price: BigInt(room.priceDetail?.halfCharge?.late?.price || 0),
            },
            extraBed: {
              isAvailable: !!room.priceDetail?.extraBed?.availability,
              isChecked: !!room.priceDetail?.extraBed?.mandatoryChecked,
              price: BigInt(room.priceDetail?.extraBed?.price || 0),
              isMandatory: !!room.priceDetail?.extraBed?.mandatoryChecked,
            },
            passengerCount: {
              count: !!orderData?.hotelInfo?.isInternational
                ? passengersCount[idx].adult + passengersCount[idx].child
                : Number(room.roomInfo?.capacity) || 0,
            },
            roomId: room.roomId,
            roomePrice: BigInt(room?.priceDetail?.price?.totalPrice || 0),
            hasBreakfast: room?.roomInfo?.hasBreakfast,
            refundable: room?.roomInfo?.refundable,
          });
        });
        setRoomsPassengers([...roomsArr]);
      }
    }
  }, [orderData]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  const [totalPrice, setTotalPrice] = useState<bigint>(BigInt(0));
  const [totalNights, setTotalNights] = useState<string | string[] | undefined>('0');

  const { isLoading: addPassengerIsLoading, mutate: addPassengerCall } = useMutation(
    () => {
      const payload: { rooms: Record<string, unknown>[] } = { rooms: [] };
      roomsPassengers.forEach((item) => {
        payload.rooms.push({
          id: item.roomId as string,
          leaderId: item.leader?.id as string,
          guestIds: item.passengers
            ?.filter((guest) => {
              return guest.id !== item.leader?.id;
            })
            ?.map((guest) => {
              return guest.id;
            }) as string[],
          earlyCheckin: item.earlyCheckin?.isChecked as boolean,
          lateCheckout: item.lateCheckout?.isChecked as boolean,
          extraBed: item.extraBed?.isChecked as boolean,
        });
      });
      return hotelAddPassengersV2(query.orderId as string, payload);
    },
    {
      onError: (err: { response: { data: TErrorResponse } }) => {
        if (err?.response?.data?.details) {
          notify({
            type: 'error',
            message: <span>{err?.response?.data?.details[0].message as string}</span>,
            config: {
              position: 'top-center',
              hideProgressBar: true,
              draggable: false,
            },
          });
        }
      },
      onSettled: () => {
        setSearchButtonClicked(false);
      },
      onSuccess: (res) => {
        router.push(`/hotel/checkout/${res?.orderId}`);
      },
      retry: false,
    },
  );

  const roomsSummaryRef = useRef<HTMLDivElement>(null);
  const [roomsSummaryIsVisible, setRoomsSummaryIsVisible] = useState(false);
  const platform = useRef<string | null | undefined>(null);
  useEffect(() => {
    platform.current = sessionStorage.getItem('platform');
  }, []);
  useEffect(() => {
    if (roomsSummaryRef.current) {
      const style = roomsSummaryRef.current.style;
      if (roomsSummaryIsVisible) {
        style.height = 'auto';
        const height = roomsSummaryRef.current.offsetHeight + 'px';
        style.height = '0';
        setTimeout(() => {
          style.height = height;
        }, 80);
      } else style.height = '0';
    }
  }, [roomsSummaryIsVisible]);

  const [passengerModal, setPassengerModal] = useState<{
    isVisible: boolean;
    idx: number | null;
  }>({
    isVisible: false,
    idx: null,
  });

  const addLeaderCallBack: AddLeaderCallBack = (selectedLeader, selectedPassengers) => {
    const { selectedLeader: leader } = selectedLeader;
    const leaderName = leader?.persianName
      ? leader.persianName + ' ' + leader.persianFamily
      : leader?.englishName + ' ' + leader?.englishFamily;
    const passengers = selectedPassengers.map((item) => {
      return {
        name: item.persianName
          ? item.persianName + ' ' + item.persianFamily
          : item?.englishName + ' ' + item?.englishFamily,
        id: item?.id,
      };
    });
    const newPassengerType = cloneDeep(roomsPassengers);
    newPassengerType[passengerModal.idx as number].leader = {
      id: selectedLeader.selectedLeader?.id as string,
      name: leaderName,
    };
    newPassengerType[passengerModal.idx as number].passengers = passengers;
    localStorage.setItem('hotel_room_passenger', superjson.stringify(newPassengerType));
    setRoomsPassengers(newPassengerType);
    setPassengerModal({ isVisible: false, idx: 0 });
    // window.history.back();
  };

  const [disabledPassengers, setDisabledPassengers] = useState<string[]>([]);
  const diablePassengerId = (idx: number) => {
    let ids: string[] = [];

    roomsPassengers.forEach((item, index) => {
      if (index !== idx && item.passengers) {
        const disabled = item.passengers
          .map((passenger) => passenger.id)
          .filter((id) => id !== undefined);
        ids = [...ids, ...(disabled as string[])];
      }
    });
    setDisabledPassengers(ids);
  };

  const addPassengerRef = useRef<AddPassengerRef>();

  const selectedPassenger = () => {
    const selected: string[] = [];
    roomsPassengers.forEach((item) => {
      item.passengers?.forEach((item) => {
        selected.push(item.id as string);
      });
    });
    return selected;
  };

  useEffect(() => {
    const handlePopState = () => {
      setPassengerModal({ isVisible: false, idx: null });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  return (
    <>
      <Modal visible={passengerModal.isVisible}>
        <div className={style['modal']}>
          <Header
            title="لیست مسافران"
            setShow={() => {
              setPassengerModal({ isVisible: false, idx: null });
              // window.history.back();
            }}
            showAdd
            addOnClick={() => {
              addPassengerRef?.current?.showAddModal(true);
            }}
          />
          <div className={style['modal__list']}>
            <Suspense fallback={<Spinner />}>
              <PassengerList
                ref={addPassengerRef}
                maxSelectable={
                  passengerModal.isVisible
                    ? roomsPassengers[passengerModal.idx as number].passengerCount?.count
                    : undefined
                }
                showSelectedCount={orderData?.hotelInfo?.isInternational}
                lockSelection={orderData?.hotelInfo?.isInternational}
                serviceName={
                  orderData?.hotelInfo?.isInternational ? 'international-hotel' : 'domestic-hotel'
                }
                selectedPassengers={passengerModal.isVisible ? selectedPassenger() : undefined}
                addLeaderCallBack={addLeaderCallBack}
                isConfirmButton
                selectLeader
                disabledPassengers={disabledPassengers}
                backButton={() => {
                  setPassengerModal({ isVisible: false, idx: null });
                  // window.history.back();
                }}
              />
            </Suspense>
          </div>
        </div>
      </Modal>
      <div className={style['factor-rooms']}>
        <div className={style['rooms']}>
          {roomsPassengers.map((item, idx) => {
            return (
              <div key={item.roomId} className={style['rooms__room']}>
                <div className={style['rooms__room--header']}>
                  <div
                    role="button"
                    key={item.roomId}
                    onClick={() => {
                      diablePassengerId(idx);
                      window.history.pushState({ modal: true }, '');
                      setPassengerModal({ isVisible: true, idx: idx });
                    }}
                    className={style['rooms__room--choose']}
                  >
                    <ArrowLeftPrimaryColor />
                    <span>
                      {item.passengers && item.passengers?.length > 0
                        ? 'تغییر مسافران'
                        : 'انتخاب مسافران'}
                    </span>
                  </div>
                  <span className={'d-flex flex-column gap-1 text-end'}>
                    <span>
                      اتاق {roomNumber[idx + 1]}{' '}
                      <span className={style['rooms__room--capacity']}>
                        ظرفیت {item.capacity} نفر
                      </span>
                    </span>
                    <div className={style['rooms__room--name']}>{item.name}</div>
                  </span>
                </div>
                {item.leader?.id && (
                  <div className={style['rooms__room--passenger']}>
                    {' '}
                    <div className={style['rooms__room--leader']}>سرپرست</div>
                    <div>{item.leader.name}</div>
                  </div>
                )}
                {item.passengers?.map((passenger) => {
                  if (passenger.id === item?.leader?.id) {
                    return;
                  }
                  return (
                    <div key={passenger.id} className={style['rooms__room--passenger']}>
                      <div></div>
                      <div>{passenger.name}</div>
                    </div>
                  );
                })}
                {item.passengers && item.passengers?.length > 0 && (
                  <Divider style="dashed" type="horizontal" className="w-100" />
                )}

                {(item.earlyCheckin?.isAvailable || item.lateCheckout?.isAvailable) && (
                  <div className="d-flex w-100 justify-content-between align-items-center mt-4">
                    {item.earlyCheckin?.isAvailable && (
                      <div className="d-flex align-items-center">
                        <span>ورود زودهنگام</span>{' '}
                        <Checkbox
                          checked={item.earlyCheckin.isChecked}
                          handleClick={() => {
                            if (item.earlyCheckin?.isChecked) {
                              setTotalPrice(totalPrice - (item?.earlyCheckin?.price || BigInt(0)));
                              const newArr = cloneDeep(roomsPassengers);
                              newArr[idx].earlyCheckin!.isChecked = false;
                              setRoomsPassengers(newArr);
                              localStorage.setItem(
                                'hotel_room_passenger',
                                superjson.stringify(newArr),
                              );
                            } else {
                              setTotalPrice(totalPrice + (item?.earlyCheckin?.price || BigInt(0)));
                              const newArr = cloneDeep(roomsPassengers);
                              newArr[idx].earlyCheckin!.isChecked = true;
                              setRoomsPassengers(newArr);
                              localStorage.setItem(
                                'hotel_room_passenger',
                                superjson.stringify(newArr),
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                    {item.lateCheckout?.isAvailable && (
                      <div className="d-flex align-items-center">
                        <span>خروج دیرهنگام</span>{' '}
                        <Checkbox
                          checked={item.lateCheckout.isChecked}
                          handleClick={() => {
                            if (item.lateCheckout?.isChecked) {
                              setTotalPrice(totalPrice - (item?.lateCheckout?.price || BigInt(0)));
                              const newArr = cloneDeep(roomsPassengers);
                              newArr[idx].lateCheckout!.isChecked = false;
                              setRoomsPassengers(newArr);
                              localStorage.setItem(
                                'hotel_room_passenger',
                                superjson.stringify(newArr),
                              );
                            } else {
                              setTotalPrice(totalPrice + (item?.lateCheckout?.price || BigInt(0)));
                              const newArr = cloneDeep(roomsPassengers);
                              newArr[idx].lateCheckout!.isChecked = true;
                              setRoomsPassengers(newArr);
                              localStorage.setItem(
                                'hotel_room_passenger',
                                superjson.stringify(newArr),
                              );
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {item.extraBed?.isAvailable && (
                  <div className="d-flex align-items-center align-self-end mt-4">
                    <span>سرویس اضافه</span>{' '}
                    <Checkbox
                      disabled={item.extraBed.isMandatory}
                      checked={item.extraBed.isChecked}
                      handleClick={() => {
                        if (item.extraBed?.isChecked) {
                          setTotalPrice(totalPrice - (item?.extraBed?.price || BigInt(0)));
                          const newArr = cloneDeep(roomsPassengers);
                          newArr[idx].extraBed!.isChecked = false;
                          setRoomsPassengers(newArr);
                          localStorage.setItem('hotel_room_passenger', superjson.stringify(newArr));
                        } else {
                          setTotalPrice(totalPrice + (item?.extraBed?.price || BigInt(0)));
                          const newArr = cloneDeep(roomsPassengers);
                          newArr[idx].extraBed!.isChecked = true;
                          setRoomsPassengers(newArr);
                          localStorage.setItem('hotel_room_passenger', superjson.stringify(newArr));
                        }
                      }}
                    />
                  </div>
                )}

                {/* <Checkbox /> */}
              </div>
            );
          })}
        </div>
        {props.device === 'desktop' && (
          <div style={{ minWidth: '440px' }} className="mb-5 pt-3">
            <div className="w-100 row flex-row-reverse">
              <div className="w-100 col-md-8">
                <HotelInfo data={orderData} rooms={roomsPassengers} />
                <div className={style['total']}>
                  <div className={style['title']}>مجموع</div>
                  <div className={style['price']}>
                    <span>{totalPrice.toLocaleString()}</span>
                    <span className={style['unit']}>ریال</span>
                  </div>
                </div>
                <Button
                  radius
                  className="btn btn-primary me-2 px-5 w-100"
                  btnType="button"
                  onClick={() => {
                    addPassengerCall();
                  }}
                  loading={addPassengerIsLoading}
                >
                  بررسی نهایی و پرداخت
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {props.device === 'mobile' ? (
        <>
          <div
            className={cn(
              style['footer'],
              platform.current === 'superapp' && style['footer__super-app'],
            )}
          >
            <div className={style['rooms-summary']} ref={roomsSummaryRef}>
              <div className={style['content']}>
                {roomsPassengers?.map((room) => (
                  <div key={room.roomId}>
                    <div className={style['room']}>
                      <div className={style['title']}>{room.name}</div>
                      <div className={style['price']}>
                        <span>
                          {room?.roomePrice?.toLocaleString() || 0}
                          <span>ریال</span>
                        </span>
                        <span>x 1</span>
                      </div>
                    </div>
                    {room.earlyCheckin?.isChecked ? (
                      <div className={style['room']}>
                        <div className="text-2">ورود زود هنگام</div>
                        <div className="text-3 text-grey-1 rtl">
                          <span>
                            {room.earlyCheckin?.price?.toLocaleString()}
                            <span className="me-2">ریال</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {room.lateCheckout?.isChecked ? (
                      <div className={style['room']}>
                        <div className="text-2">خروج دیرهنگام</div>
                        <div className="text-3 text-grey-1 rtl">
                          <span>
                            {room?.lateCheckout?.price?.toLocaleString()}
                            <span className="me-2">ریال</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    {room.extraBed?.isChecked ? (
                      <div className={style['room']}>
                        <div className="text-2">سرویس اضافه</div>
                        <div className="text-3 text-grey-1 rtl">
                          <span>
                            {room?.extraBed?.price?.toLocaleString()}
                            <span className="me-2">ریال</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              className={style['info']}
              onClick={() => {
                setRoomsSummaryIsVisible(!roomsSummaryIsVisible);
              }}
            >
              <div className={style['description']}>مجموع قیمت برای {totalNights} شب</div>
              <div className={cn(style['toggle-btn'], roomsSummaryIsVisible && style['close'])}>
                <ArrowUpIcon />
              </div>
              <div className={style['price']}>
                <span className={style['value']}>{totalPrice.toLocaleString()}</span>
                <span className={style['unit']}>ریال</span>
              </div>
            </div>
            <Button
              radius
              className={cn(
                'btn btn-primary me-2 px-5',
                (searchButtonClicked || routeChangeStarted) && 'btn-light',
              )}
              btnType="button"
              onClick={() => {
                addPassengerCall();
              }}
              loading={addPassengerIsLoading}
            >
              تایید
            </Button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default HotelPassengers;
