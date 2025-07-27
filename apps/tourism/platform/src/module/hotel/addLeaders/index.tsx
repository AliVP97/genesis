import style from './style.module.scss';
import { Device } from 'utils/interface';
import AddPassengerForm from 'containers/passengers/form';
import { leaderFormFields } from './data';
import { UseGetPassengers } from './hooks/useGetPassengers';
import React, { useEffect, useState, useRef } from 'react';
import Button from 'components/button';
import { cloneDeep } from 'lodash';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import { useQuery, useMutation } from 'react-query';
import { hotelAddPassengers, getOrder } from 'services/hotel/rooms';
import { THotelPackage, THotelAddPassengers } from 'services/hotel/rooms/types';
import { LocalHotelIcon } from 'assets/icons';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import { TPassengerV2Response } from 'services/general/passenger/interface';
import router, { useRouter } from 'next/router';
import { HotelInfo } from './components/hotelInfo';
import { TGetHotelOrder } from 'services/hotel/orders/interface';
import cn from 'classnames';
import { ArrowUpIcon } from 'assets/icons';
import { useRouteChange } from '../../../utils/hooks/useRouteChange';
import { definitions } from 'types/hotel';
import { notify } from 'utils/notification';
import { TRoom, TRoomPrice, TRooms } from './interface';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginWarningBox from 'module/hotel/addLeaders/components/loginWarning';
import { fixNumbers } from 'utils/helpers/numbers';
import { flushSync } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
type TErrorResponse = definitions['rpcStatus'];
type TProps = {
  device: Device;
};
const HotelAddLeaders = (props: TProps) => {
  const { query } = useRouter();
  const { login, setLoginModalVisible } = useAuthContext();
  // const formRef = React.useRef<HTMLFormElement>(null);
  const [elRefs, setElRefs] = React.useState<Array<React.RefObject<HTMLFormElement>>>([]);
  /* refactored */

  const [orderData, setOrderData] = useState<TGetHotelOrder | undefined>();

  const getOrderDataMutation = useMutation({
    mutationFn: () => getOrder(query.orderId),
    onSuccess: (data) => {
      setOrderData(data);
    },
  });

  useEffect(() => {
    // on getOrder success:
    orderData && (localStorage.hotelOrder = JSON.stringify(orderData));
  }, [orderData]);

  useEffect(() => {
    localStorage.hotelOrder && JSON.parse(localStorage.hotelOrder).orderId === query.orderId
      ? setOrderData(JSON.parse(localStorage.hotelOrder))
      : getOrderDataMutation.mutate();
  }, []);

  // const {data: orderData}: {data: TGetHotelOrder | undefined} = useQuery(
  //   ['orderData', query.orderId],
  //   {
  //     queryFn: () => getOrder(query.orderId),
  //     enabled: !!query.orderId,
  //   },
  // );
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  const [rooms, setRooms] = useState<TRooms>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalNights, setTotalNights] = useState<string | string[] | undefined>('0');
  /*refactored*/
  useEffect(() => {
    if (orderData && elRefs.length === 0) {
      const newArrayOfRefs = [];
      for (let i = 0; i < (orderData.room?.length || 0); i++) {
        newArrayOfRefs.push(React.createRef<HTMLFormElement>());
      }
      setElRefs([...newArrayOfRefs]);
    }
  }, [orderData]);
  useEffect(() => {
    if (orderData) {
      const newRooms = toRoomsType(orderData || {});
      flushSync(() => {
        setTotalPrice(
          orderData.room?.reduce((totalPrice, room) => {
            return totalPrice + (room.priceDetail?.price?.totalPrice || 0);
          }, 0) || 0,
        );
        setTotalNights(query.nights);
        setRooms(newRooms);
      });
      rooms.forEach((item, idx) => {
        item.leader.fields.forEach((item) => {
          if (['extraBed'].includes(item?.name as string)) {
            // disable mean room has mandatory extra bed
            if (item?.disabled) {
              handleOnChange(
                {
                  type: 'field',
                  data: { name: item?.name || '', value: true },
                },
                idx,
              );
            }
          }
        });
      });
    }
  }, [orderData]);
  // add passengers as suggestion list:
  const [passengersRequestEnabled, setPassengersRequestEnabled] = useState(false);

  const { passengerLoading, passengers } = UseGetPassengers(passengersRequestEnabled && login);
  useEffect(() => {
    if (rooms.length > 0) {
      setPassengersRequestEnabled(true);
    }
  }, [rooms]);
  // request add passengers
  const [addPassengersRequestData, setAddPassengersRequestData] = useState<THotelAddPassengers[]>(
    [],
  );
  useQuery(
    ['hotelAddPassengers'],
    () => {
      const modifiedAddPassengers = [...addPassengersRequestData];
      modifiedAddPassengers.forEach((item, index) => {
        if (passengers?.passengerList) {
          for (let idx = 0; idx < passengers.passengerList.length; idx++) {
            if (item.nationalId === passengers.passengerList[idx].nationalId) {
              modifiedAddPassengers[index].id = passengers.passengerList[idx].id;
              break;
            }
          }
        }
      });

      return hotelAddPassengers({
        orderId: query.orderId,
        passengers: addPassengersRequestData,
      });
    },
    {
      enabled: !!addPassengersRequestData.length,
      cacheTime: 0,
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

  const localPassengers = useRef<TPassengerV2Response['passengerList']>();
  useEffect(() => {
    if (passengers) {
      localPassengers.current = passengers?.passengerList;
      const newRooms = cloneDeep(rooms);
      newRooms.forEach((room) => {
        room.leader.fields = room.leader.fields.map((field) => {
          field.autoCompleteSource = localPassengers.current;
          return field;
        });
      });
      setRooms(newRooms);
    }
  }, [passengers]);

  const toRoomsType: (i: THotelPackage) => TRooms = (hotelpackage) => {
    const rooms = hotelpackage.room;
    return rooms?.length
      ? rooms?.map((room, idx) => {
          const foreingner = {
            isAvailable: room.priceDetail?.halfCharge?.foreigner?.availability,
            price: room.priceDetail?.halfCharge?.foreigner?.price,
          };
          const earlyEntry = {
            isAvailable: room.priceDetail?.halfCharge?.early?.availability,
            price: room.priceDetail?.halfCharge?.early?.price,
          };
          const lateExit = {
            isAvailable: room.priceDetail?.halfCharge?.late?.availability,
            price: room.priceDetail?.halfCharge?.late?.price,
          };
          const extraBed = {
            isAvailable: room.priceDetail?.extraBed?.availability,
            price: room.priceDetail?.extraBed?.price,
            mandatoryChecked: room.priceDetail?.extraBed?.mandatoryChecked,
          };

          // update leaderFormFields' checkboxes:
          const newLeaderFormFields = cloneDeep(leaderFormFields);
          const passengers = localStorage.getItem('hotelPassengers');
          let parsedPassengers = [];
          if (passengers) {
            parsedPassengers = JSON.parse(passengers);
          }
          foreingner?.isAvailable &&
            newLeaderFormFields.push({
              name: 'foreingner',
              label: 'در این اتاق مسافر با تابعیت خارجی وجود دارد',
              type: 'checkbox',
              placeholder: '',
              visible: true,
              defaultValue: parsedPassengers[idx]?.foreingner ? 1 : 0,
            });
          earlyEntry?.isAvailable &&
            newLeaderFormFields.push({
              name: 'earlyEntry',
              label: 'ورود زودهنگام',
              type: 'checkbox',
              placeholder: '',
              visible: true,
              defaultValue: parsedPassengers[idx]?.earlyEntry ? 1 : 0,
            });
          lateExit?.isAvailable &&
            newLeaderFormFields.push({
              name: 'lateExit',
              label: 'خروج دیرهنگام',
              type: 'checkbox',
              placeholder: '',
              visible: true,
              defaultValue: parsedPassengers[idx]?.lateExit ? 1 : 0,
            });
          extraBed?.isAvailable &&
            newLeaderFormFields.push({
              name: 'extraBed',
              label: 'سرویس اضافه',
              type: 'checkbox',
              disabled: extraBed?.mandatoryChecked,
              placeholder: '',
              visible: true,
              defaultValue: extraBed?.mandatoryChecked
                ? 1
                : parsedPassengers[idx]?.extraBed
                  ? 1
                  : 0,
            });
          return {
            id: room.roomId,
            title: room.roomInfo?.name,
            leader: { id: undefined, fields: newLeaderFormFields },
            foreingner,
            earlyEntry,
            lateExit,
            extraBed,
          };
        })
      : [];
  };

  const handleOnChange = (
    e: {
      type: 'field' | undefined;
      data: Record<string, string | number | object | undefined | boolean>;
    },
    index: number,
  ) => {
    // type of "e" can be updated as union to support more types if necessary.
    let newRooms = updatedRoomsByFormFields(rooms);
    if (e.type === 'field') {
      const sign = (data: string | number | boolean | object | undefined) => {
        // should implicitly check true & false. (refactor later)
        if (data === true) return 1;
        else if (data === false) return -1;
        return 0;
      };

      const priceObj = rooms[index][e.data.name as keyof TRoom] as TRoomPrice;
      const amount = sign(e.data.value) * (priceObj?.price || 0);
      setTotalPrice((totalPrice) => totalPrice + amount);
      setRooms(newRooms);
    } else {
      // set leaderId & defaultValues 4 d current room:
      const room = cloneDeep(newRooms?.[index]);
      newRooms[index].leader.id = typeof e.data.id === 'string' ? e.data.id : '';
      newRooms[index].leader.fields = room.leader.fields.map((field) => {
        if (
          field.name === 'earlyEntry' ||
          field.name === 'lateExit' ||
          field.name === 'foreingner' ||
          field.name === 'extraBed'
        ) {
          return field;
        }
        typeof field.name === 'string' && (field.defaultValue = e.data[field.name]);
        return field;
      });

      // update rooms suggestion lists:
      // 1. update local passengers (remove currently selected / add already selected):
      const newLocalPassengers = cloneDeep(localPassengers.current)?.filter(
        (passenger) => passenger.id !== e.data.id,
      );
      if (room.leader.id) {
        const originalPassenger = cloneDeep(passengers)?.passengerList?.find(
          (passenger) => passenger.id === room.leader.id,
        );
        const selectedPassengerAlreadySelected = e.data.id === room.leader.id;
        !selectedPassengerAlreadySelected &&
          originalPassenger &&
          newLocalPassengers?.push(originalPassenger);
      }
      localPassengers.current = newLocalPassengers;

      // 2. add already selected room leader to the room's suggestion list
      newRooms = newRooms.map((room) => {
        // (refactor: rename "autoCompleteSource"s to "suggestionList")
        const suggestionList = cloneDeep(localPassengers.current);

        if (room.leader.id) {
          const roomLeader = passengers?.passengerList?.find(
            (passenger) => passenger.id === room.leader.id,
          );
          roomLeader && suggestionList?.push(roomLeader);
        }

        room.leader.fields = room.leader.fields.map((field) => {
          field.autoCompleteSource = suggestionList;
          return field;
        });
        return room;
      });

      setRooms(newRooms);
    }
  };
  const formsSubmittedLeaders = useRef<Record<string, string | number | boolean | undefined>[]>([]);
  const handleFormsSubmit = () => {
    if (!login) {
      setLoginModalVisible(true);
      return;
    }
    formsSubmittedLeaders.current = [];
    elRefs.forEach((item) => {
      item.current?.requestSubmit();
    });
  };
  const handleFormOnSubmit = (data: Record<string, string | number | boolean | undefined>) => {
    formsSubmittedLeaders.current.push(data);

    // if all submit btns send value (if all forms are valid):
    if (formsSubmittedLeaders.current.length === rooms.length) {
      const addPassengersRequestData: THotelAddPassengers[] = new Array(rooms.length)
        .fill('')
        .map((_, index) => {
          const room = rooms[index];
          const passengersJson = localStorage.getItem('hotelPassengers');
          let passengers = [];
          if (passengersJson) {
            passengers = JSON.parse(passengersJson);
          }
          const passenger = passengers[index];

          const phoneNumber = fixNumbers(passenger.phoneNumber as string);
          const nationalId = fixNumbers(passenger.nationalId as string);

          return {
            id: room.leader.id,
            name: passenger.persianName as string | undefined,
            family: passenger.persianFamily as string | undefined,
            nationalId: nationalId as string | undefined,
            phone: phoneNumber as string | undefined,
            roomID: room.id,
            isForeigner: passenger.foreingner as boolean | undefined,
            earlyCheckin: passenger.earlyEntry as boolean | undefined,
            lateCheckout: passenger.lateExit as boolean | undefined,
            extraBed:
              room.extraBed?.mandatoryChecked || (passenger?.extraBed as boolean | undefined),
          };
        });
      const nationalIds = addPassengersRequestData.map((item) => {
        return item.nationalId;
      });
      const removedDupNationalIds = new Set([...nationalIds]);
      if (nationalIds.length !== removedDupNationalIds.size) {
        notify({ type: 'error', message: 'کد ملی سرپرست تکراری است' });
        return;
      }

      // Request Add Passengers API:
      setSearchButtonClicked(true);
      setRooms(updatedRoomsByFormFields(rooms));
      addPassengersRequestData && setAddPassengersRequestData(addPassengersRequestData);
    }
  };
  const getPassengerName = (index: number) => {
    const firstName = (elRefs[index].current?.[0] as HTMLInputElement)?.value;
    const lastName = (elRefs[index].current?.[1] as HTMLInputElement)?.value;

    return firstName?.replace(/\s/g, '') && lastName?.replace(/\s/g, '')
      ? firstName + ' ' + lastName
      : undefined;
  };

  const updatedRoomsByFormFields = (rooms: TRooms) => {
    const newRooms = cloneDeep(rooms);
    elRefs.forEach((ref, index) => {
      newRooms?.[index]?.leader?.fields?.forEach((field, index) => {
        field.defaultValue = (ref.current?.[index] as HTMLInputElement)?.value;
      });
    });
    return newRooms;
  };

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
  }, [roomsSummaryIsVisible, rooms]);
  const changePriceOnLoad = useRef(true);
  useEffect(() => {
    if (changePriceOnLoad.current && rooms.length > 0) {
      rooms.forEach((item, idx) => {
        item.leader.fields.forEach((item) => {
          if (['earlyEntry', 'lateExit', 'foreingner', 'extraBed'].includes(item?.name as string)) {
            if (item?.defaultValue === 1) {
              handleOnChange(
                {
                  type: 'field',
                  data: { name: item?.name || '', value: true },
                },
                idx,
              );
            }
          }
        });
      });
      changePriceOnLoad.current = false;
    }
  }, [rooms]);

  const { hotelData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  useEffect(() => {
    if (hotelData) {
      if (hotelData instanceof Object && 'data' in hotelData) {
        const hotelEvent = new HotelTrackingEvent();
        hotelEvent.beginCheckout(hotelData as hotelViewListItemModel);
      }
    }
  }, []);

  return (
    <>
      {!login ? (
        <div className="mt-2">
          <LoginWarningBox />
        </div>
      ) : (
        <></>
      )}

      {props.device === 'mobile' ? (
        <>
          <div className={style['rooms']}>
            <Accordion allowMultipleExpanded={true} preExpanded={[0]}>
              {rooms.map((room, index) => (
                <AccordionItem key={index.toString() + room.id + room.title} uuid={index}>
                  <div
                    className={cn(
                      style['room'],
                      platform.current === 'superapp' &&
                        index === rooms.length - 1 &&
                        style['room--super-app'],
                    )}
                  >
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <div className={style['header']}>
                          <LocalHotelIcon />
                          اتاق {PersianIndexNumber[index]} ({rooms[index].title})
                        </div>
                        <div className={style['form-description']}>
                          <AccordionItemState>
                            {({ expanded }) =>
                              expanded
                                ? 'سرپرست مسافران را انتخاب نمایید'
                                : getPassengerName(index) || 'سرپرست مسافران را انتخاب نمایید'
                            }
                          </AccordionItemState>
                        </div>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className={style['form']}>
                        <AddPassengerForm
                          index={index}
                          key={index.toString() + 'addLeaders'}
                          cachePassengers={true}
                          hotelAddLeader={true}
                          forms={[room.leader.fields]}
                          onSubmit={handleFormOnSubmit}
                          ref={elRefs[index]}
                          showSubmit={false}
                          loading={passengerLoading}
                          onChange={(e) => {
                            handleOnChange(e, index);
                          }}
                          // propControl={control}
                        />
                      </div>
                    </AccordionItemPanel>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div
            className={cn(
              style['footer'],
              platform.current === 'superapp' && style['footer__super-app'],
            )}
          >
            <div className={style['rooms-summary']} ref={roomsSummaryRef}>
              <div className={style['content']}>
                {orderData?.room?.map((room, index) => {
                  const extraBedField = rooms[index]?.leader.fields.find(
                    (item) => item.name === 'extraBed',
                  );
                  return (
                    <div key={index.toString() + room?.hotelId + room?.roomId}>
                      <div className={style['room']}>
                        <div className={style['title']}>{room.roomInfo?.name}</div>
                        <div className={style['price']}>
                          <span>
                            {room.priceDetail?.price?.totalPrice?.toLocaleString() || 0}
                            <span>ریال</span>
                          </span>
                          <span>x 1</span>
                        </div>
                      </div>
                      {rooms[index] &&
                      rooms[index].leader.fields.find((item) => {
                        return item.name === 'earlyEntry';
                      })?.defaultValue === 'true' ? (
                        <div className={style['room']}>
                          <div className="text-2">ورود زود هنگام</div>
                          <div className="text-3 text-grey-1 rtl">
                            <span>
                              {rooms[index].earlyEntry.price?.toLocaleString()}
                              <span className="me-2">ریال</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {rooms[index] &&
                      rooms[index].leader.fields.find((item) => {
                        return item.name === 'lateExit';
                      })?.defaultValue === 'true' ? (
                        <div className={style['room']}>
                          <div className="text-2">خروج دیرهنگام</div>
                          <div className="text-3 text-grey-1 rtl">
                            <span>
                              {rooms[index].lateExit.price?.toLocaleString()}
                              <span className="me-2">ریال</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {(rooms[index] && extraBedField?.defaultValue === 'true') ||
                      extraBedField?.disabled ? (
                        <div className={style['room']}>
                          <div className="text-2">سرویس اضافه</div>
                          <div className="text-3 text-grey-1 rtl">
                            <span>
                              {rooms[index].extraBed.price?.toLocaleString()}
                              <span className="me-2">ریال</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
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
                handleFormsSubmit();
              }}
              loading={searchButtonClicked || routeChangeStarted}
            >
              تایید
            </Button>
          </div>
        </>
      ) : (
        <div className="container mb-5 pt-3">
          <div className="row flex-row-reverse">
            <div className="col-md-8">
              <div className={style['main-desc']}>سرپرست مسافران را انتخاب نمایید.</div>
              <div className={style['rooms']}>
                {rooms.map((room, index) => (
                  <div className={style['room']} key={index.toString() + room.title + room.id}>
                    <div className={style['header']}>
                      <LocalHotelIcon />
                      <span className={style['title']}>اتاق {PersianIndexNumber[index]} </span> (
                      {rooms[index].title})
                    </div>
                    <div className={style['form']}>
                      <AddPassengerForm
                        index={index}
                        key={room.id + 'hotelAddLeaders'}
                        forms={[room.leader.fields]}
                        onSubmit={handleFormOnSubmit}
                        ref={elRefs[index]}
                        showSubmit={false}
                        loading={passengerLoading}
                        onChange={(e) => {
                          handleOnChange(e, index);
                        }}
                        hotelAddLeader={true}
                        cachePassengers={true}
                        // propControl={control}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <HotelInfo data={orderData} rooms={rooms} />
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
                onClick={handleFormsSubmit}
              >
                بررسی نهایی و پرداخت
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { HotelAddLeaders };
