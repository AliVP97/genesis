// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import HeaderHoc from 'components/headerHoc';
import Slider from './components/slider';
import styles from './details.module.scss';
import cn from 'classnames';
import Header from './components/header';
import TravelTabSelector from './components/tabSelector/inex';
import { HotelDetailsTabType } from './types';
import Content from './components/content';
import Rooms, { TSelectedRoom } from './components/rooms';
import { useRouter } from 'next/router';
import useGetHotelRooms from './hooks/useGetHotelRooms';
import { THotelRooms, TRoom, TRoomDetails } from 'services/hotel/detail/interface';
import { Device } from 'utils/interface';
import {
  CloseIcon,
  GalleryIcon,
  UserIcon,
  SliderLeft,
  SliderRight,
  DownArrow,
  FlagIcon,
  EyeIcon,
} from 'assets/icons';
import { ReportModal } from './components/report';

import Button from 'components/button';
import Image from 'next/image';
import Modal from 'components/modal';
import { UseGallery } from 'module/hotel/detail/hooks/useGallery';
import classNames from 'classnames';
import { HotelHeader } from 'module/hotel/detail/components/hotelHeader';
import { THotelInfo } from 'services/hotel/hotelsAndCities/interface';
import { HotelDetailGallery } from 'module/hotel/detail/components/gallery';
import { RulesAndFacility } from 'module/hotel/detail/components/rulesAndFacility';
import { TypeOfRooms } from 'module/hotel/detail/components/typeOfRooms';
import { SumOfRooms } from 'module/hotel/detail/components/sumOfRooms';
import SimilarHotels from './components/content/components/similarHotels';
import { hotelUpdateLastSearchStorage } from 'utils/helpers/localstorageHelper';
import { useAddRooms } from './hooks/useAddRooms';
import AboutHotel from './components/aboutHotel';
import ImportantPlacesAndMap from './components/importantPlacesAndMap';
import { useQuery } from 'react-query';
import { getSimilarHotels } from 'services/hotel/detail/similar';
import { RoomFooter } from './components/rooms/footer';
import { isObjectNotEmpty } from 'utils/helpers/checkEmptyValue';
import { notify } from 'utils/notification';
import Spinner from 'components/spinner';
import { HotelNotFound } from 'assets/images';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import RoomDetailsModal from './components/roomDetails';
import { schema } from 'utils/static/cms/schema';
import Review from '../comment/review';
import { useReport } from './components/report/hooks/useReport';

interface Props {
  device: Device;
  detail: THotelInfo;
}
const HotelInfo = ({ device, detail: hotel }: Props) => {
  const [newArray, setNewArray] = useState<
    Array<{
      id: number;
      isSelected: boolean;
      selectedRoom?: TRoomDetails;
      person: { adult: string; child: Array<{ value: 'string' }> };
      sumPrice: number;
    }>
  >([]);
  const [roomTypeId, setRoomTypeId] = useState<number>(0);
  const [tabBarItem, setTabBarItem] = useState<
    Array<{ id: number; name: string; isSelected: boolean }>
  >([
    { id: 1, name: 'اتاق ها', isSelected: true },
    { id: 2, name: 'امکانات ', isSelected: false },
    { id: 3, name: 'قوانین و مقررات ', isSelected: false },
    { id: 4, name: 'موقعیت مکانی هتل ', isSelected: false },
    { id: 5, name: 'هتل‌های مشابه', isSelected: false },
    { id: 6, name: 'امتیاز و نظرات', isSelected: false },
  ]);
  const [sumTotalPriceRooms, SetsumTotalPriceRooms] = useState<number>(0);
  const [dupHotelRooms, setDupHotelRooms] = useState<THotelRooms>();
  const { visibleGallery, onSelectImage, imageIndex, setVisibleGalleryModal, setImageIndex } =
    UseGallery();
  const { login, setLoginModalVisible, visible } = useAuthContext();
  const {
    openReportModal,
    setOpenReportModal,
    reportImageTypes,
    setFormData,
    formData,
    handleSubmitReportImage,
    imageSelected,
    setImageSelected,
    accessOpenReportModal,
    setAccessOpenReportModal,
    isSuccess,
  } = useReport();

  const isShowReportImageEffect =
    imageSelected === `${hotel?.details?.images[imageIndex]}` && isSuccess;

  useEffect(() => {
    if (login && accessOpenReportModal) {
      setOpenReportModal(true);
      setVisibleGalleryModal();
    }
  }, [login, accessOpenReportModal]);
  const { query } = useRouter();
  const hotelInfo = JSON.parse(String(localStorage.getItem('hotel_last_search')));
  const { hotelRooms, numberToPersianWorld, hotelRoomsLoading } = useGetHotelRooms({
    hotelId: query?.uuid?.toString() || '',
    requestId: query?.requestId?.toString() ?? '',
  });
  const { data: similarHotels, isLoading: similarHotelIsLoading } = useQuery(
    ['similarHotels', query?.hotelId as string, query.id as string],
    () => {
      return getSimilarHotels({
        hotelId: query?.hotelId as string,
        requestId: query?.requestId?.toString(),
      });
    },
  );

  useEffect(() => {
    const filterAndMapRooms = () => {
      if (hotelRooms) {
        const x = hotelRooms?.rooms?.filter((item) => {
          if (item?.group?.groupIds?.some((groupId) => groupId === roomTypeId)) {
            return item;
          }
        });

        const updatedRooms = x?.map((ele) => {
          if (ele?.room?.roomId === newArray[roomTypeId]?.selectedRoom?.roomId) {
            return { ...ele, selected: true };
          }
          return ele;
        });

        setDupHotelRooms((prevState) => ({
          ...prevState,
          rooms: updatedRooms,
          nights: hotelRooms.nights,
          selected: new Array(updatedRooms?.length).fill(0),
        }));
      }
    };

    filterAndMapRooms();
  }, [hotelRooms, roomTypeId]);
  const passenger = hotelInfo ? hotelInfo[0]?.passenger : [];
  const initializeNewArray = () => {
    if (passenger.length) {
      const updatedArray: Array<{
        id: number;
        isSelected: boolean;
        selectedRoom?: TRoomDetails;
        person: { adult: string; child: Array<{ value: 'string' }> };
        sumPrice: number;
      }> = [];
      for (let i = 0; i < passenger.length; i++) {
        const newItem: {
          selectedRoom: TRoom;
          id: number;
          isSelected: boolean;
          person: { adult: string; child: Array<{ value: 'string' }> };
        } = {
          selectedRoom: {},
          id: 0,
          isSelected: false,
          person: {
            adult: '',
            child: [],
          },
        };

        if (i === 0) {
          newItem.isSelected = true;
        }
        if (passenger.length > i) {
          newItem['person'] = passenger[i];
        }
        newItem.id = i;
        newItem.selectedRoom = {};

        updatedArray.push(newItem);
      }
      setNewArray(updatedArray);
    }
  };

  useEffect(() => {
    initializeNewArray();
  }, [hotelRooms]);

  const handleItemClick = (index: number) => {
    setRoomTypeId(index);
    setNewArray((prevArray) => {
      const updatedArray = prevArray.map((item, i) => ({
        ...item,
        isSelected: i === index, // Set isSelected to true for the clicked index and false for others
      }));
      return updatedArray;
    });
  };
  const memoizedNewArray = useMemo(() => newArray, [newArray]);
  const router = useRouter();
  const [active, setActive] = useState<string>(HotelDetailsTabType.ROOMS);
  function isObjectEmpty(obj: { [key: string]: unknown }): boolean {
    return Object.keys(obj).length === 0;
  }
  function autoGoToNextRoom(items: [], currentIndex: number): boolean {
    if (currentIndex === newArray.length - 1) {
      return false;
    }
    for (let i = 0; i < currentIndex; i++) {
      if (isObjectEmpty(items[i].selectedRoom)) {
        return false;
      }
    }
    for (let i = currentIndex + 1; i < items.length; i++) {
      if (!isObjectEmpty(items[i].selectedRoom)) {
        return false;
      }
    }
    return true;
  }
  const { hotelData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  const handleReserveRoom = (value: TRoom) => {
    const roomId = value?.room?.roomId;
    const quantity = value?.room?.roomInfo?.quantity;
    let index: number | null = null;
    const selected = newArray.find((item, idx) => {
      index = idx;
      return item.isSelected;
    });

    if (selected?.selectedRoom?.roomId !== roomId && quantity === 0) {
      notify({ type: 'info', message: 'اتاق ظرفیت ندارد' });
      return;
    }
    const dupNewArray = newArray;
    let changeCurrentSelectedRoom = -1;
    let changeDeSelectedRoomId;
    dupNewArray.map((element) => {
      if (element.isSelected) {
        if (element.selectedRoom?.roomId && element.selectedRoom?.roomId === roomId) {
          element.selectedRoom = {};
          changeCurrentSelectedRoom = 1;
        } else {
          if (isObjectNotEmpty(element.selectedRoom)) {
            changeDeSelectedRoomId = element.selectedRoom?.roomId;
          }
          element.selectedRoom = value.room;
        }
      }
    });
    const roomsTotalPrice = memoizedNewArray.reduce((accumulator, ele) => {
      const totalPrice = ele?.selectedRoom?.priceDetail?.price?.totalPrice;
      if (typeof totalPrice === 'number') {
        accumulator += totalPrice;
      }
      return accumulator;
    }, 0);
    SetsumTotalPriceRooms(roomsTotalPrice);

    setNewArray(dupNewArray);
    setDupHotelRooms((prevState) => ({
      ...prevState,
      rooms:
        prevState?.rooms &&
        prevState?.rooms.map((roomObj) => {
          if (changeDeSelectedRoomId) {
            if (
              changeDeSelectedRoomId === roomObj.room?.roomId &&
              roomObj.room?.roomInfo?.quantity !== undefined &&
              !isNaN(Number(roomObj.room?.roomInfo?.quantity))
            ) {
              roomObj.room.roomInfo.quantity++;
            }
          }
          if (
            roomId === roomObj?.room?.roomId &&
            roomObj.room?.roomInfo?.quantity !== undefined &&
            !isNaN(Number(roomObj.room?.roomInfo?.quantity))
          ) {
            roomObj.room.roomInfo.quantity += changeCurrentSelectedRoom;

            if (hotelData) {
              if (hotelData instanceof Object && 'data' in hotelData) {
                const hotelEvent = new HotelTrackingEvent();
                roomObj.selected == true
                  ? hotelEvent.removeFromCart(hotelData as hotelViewListItemModel, roomsTotalPrice)
                  : hotelEvent.addToCart(hotelData as hotelViewListItemModel, roomsTotalPrice);
              }
            }

            return {
              ...roomObj,
              selected: roomObj.selected == true ? false : true,
            };
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { selected, ...rest } = roomObj;
            return rest;
          }
        }),
    }));

    if (autoGoToNextRoom(newArray, index)) {
      handleItemClick(index + 1);
    }
  };
  const handleBackAndSearch = () => {
    if (!hotelInfo) {
      return;
    }
    const lastSearch = hotelInfo[0];
    lastSearch.origin.city = hotel?.details?.city?.name as string;
    lastSearch.origin.value = hotel?.details?.city?.cityId as string;
    lastSearch.origin.type.id = 'city';
    lastSearch.origin.type.title = 'شهر';
    hotelUpdateLastSearchStorage(lastSearch);
    sessionStorage.setItem('searchHotel', 'autoSearch');
    router.push('/hotel?readCache=true');
  };
  const searchInfo = router?.query?.rooms;

  const roomsInfo = searchInfo?.split('-')?.map((room: string) => ({
    Adult: room?.split(',').length,
    Child: room?.includes('CHILD') ? room?.split('+CHILD_')?.length : 0,
  }));
  // const handleBack = () => {
  //   router.push('/hotel');
  // };

  useEffect(() => {
    if (roomsInfo?.length) {
      const passenger = {
        earlyEntry: false,
        lateExit: false,
        extraBed: false,
        nationalId: '',
        persianFamily: '',
        persianName: '',
        phoneNumber: '',
      };
      const passengers = Array(roomsInfo.length).fill(passenger);
      localStorage.setItem('hotelPassengers', JSON.stringify(passengers));
    }
  }, [roomsInfo]);
  const allUndefined = memoizedNewArray.every(({ selectedRoom }) => {
    return !Object.keys(selectedRoom).length;
  });

  const allDefined = memoizedNewArray.every(({ selectedRoom }) => {
    return Object?.keys(selectedRoom)?.length > 0;
  });
  const RoomsRef = useRef<HTMLInputElement>(null);
  const facilityRef = React.useRef<HTMLInputElement>(null);
  const rulesRef = React.useRef<HTMLInputElement>(null);
  const importantPlacesAndMap = React.useRef<HTMLInputElement>(null);
  const commentReview = React.useRef<HTMLInputElement>(null);
  const similarHotelSRef = React.useRef<HTMLInputElement>(null);
  const handleRefScrolls = (index: number) => {
    const contentElement = RoomsRef?.current;
    const contentElementFacilityRef = facilityRef?.current;
    const contentElementRulesRef = rulesRef?.current;
    const contentSimilarHotelSRef = similarHotelSRef?.current;
    const contentMapAndImportantPlaces = importantPlacesAndMap?.current;
    const commentAndReview = commentReview?.current;
    switch (index - 1) {
      case 0:
        contentElement?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 1:
        contentElementFacilityRef?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 2:
        contentElementRulesRef?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 3:
        contentMapAndImportantPlaces?.scrollIntoView({
          behavior: 'smooth',
        });
        break;
      case 4:
        contentSimilarHotelSRef?.scrollIntoView({ behavior: 'smooth' });
        return;
      case 5:
        commentAndReview?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };
  const handleTabClick = (index: number) => {
    handleRefScrolls(index);
    const updatedTabBarItem = tabBarItem.map((item) => {
      if (item.id === index) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });

    setTabBarItem(updatedTabBarItem);
  };
  const { createHotelOrder, createOrderIsLoading } = useAddRooms();
  const [selectedRooms, setSelectedRooms] = useState<TSelectedRoom>();
  const [isloginStarted, setIsLoginStarted] = useState(false);

  const handleAddRooms = () => {
    if (!login) {
      setLoginModalVisible(true);
      setIsLoginStarted(true);
      return;
    }
    createHotelOrder({
      roomIds: memoizedNewArray?.map((room) => {
        return room?.selectedRoom?.roomId;
      }),
      requestId: query?.requestId?.toString(),
      hotelId: router?.query?.hotelId?.toString(),
      cityId: hotelInfo[0]?.origin?.value ?? '',
      nights: hotelRooms.nights,
    });
  };
  const handleAddRoomsMobile = () => {
    if (!login) {
      setLoginModalVisible(true);
      setIsLoginStarted(true);
      return;
    }
    createHotelOrder({
      roomIds: Object.values(selectedRooms!)?.map((room) => {
        return room?.[0]?.room?.roomId ?? '';
      }),
      requestId: query?.requestId?.toString(),
      hotelId: router?.query?.hotelId?.toString(),
      cityId: hotelInfo[0]?.origin?.value ?? '',
      nights: hotelRooms.nights,
    });
  };
  useEffect(() => {
    if (isloginStarted && login) {
      setIsLoginStarted(false);

      if (device === Device.mobile) {
        handleAddRoomsMobile();
      } else {
        handleAddRooms();
      }
    }
  }, [login]);
  useEffect(() => {
    if (!visible) {
      setIsLoginStarted(false);
    }
  }, [visible]);
  useEffect(() => {
    localStorage.removeItem('hotel_room_passenger');
  }, []);

  const [openRoomModal, setOpenRoomModal] = useState();

  const handleRoomDetail = (roomId: string) => {
    setOpenRoomModal((prev) => (prev === roomId ? null : roomId));
  };

  const reportModalComponent = (
    <ReportModal
      handleSubmitReportImage={handleSubmitReportImage}
      reportType={formData?.reportType}
      setFormData={setFormData}
      reportTypes={reportImageTypes}
      openReportModal={openReportModal}
      setOpenReportModal={setOpenReportModal}
      device={device}
      cover={imageSelected}
    />
  );

  return device === Device.mobile ? (
    <>
      {hotelRooms?.rooms?.length ? schema.hotel(hotel, hotelRooms?.rooms) : ''}
      <HeaderHoc>
        <span>{hotel?.details?.name}</span>
      </HeaderHoc>
      {reportModalComponent}
      <div className="row p-0">
        {hotel?.details?.images && hotel?.details?.images?.length > 0 && (
          <Slider
            login={login}
            setAccessOpenReportModal={setAccessOpenReportModal}
            setLoginModalVisible={setLoginModalVisible}
            setOpenReportModal={setOpenReportModal}
            setImageSelected={setImageSelected}
            startPos="rtl"
            images={hotel?.details?.images}
            title={hotel?.details?.name || ''}
          />
        )}
      </div>
      <div className={cn(styles['details-content'], 'row')}>
        <div className="mt-4 text-center">
          <Header title={hotel?.details?.name || ''} rate={hotel?.details?.star || 0} />
        </div>
        <div>
          <TravelTabSelector
            activeTab={active}
            setActiveTab={setActive}
            tabs={HotelDetailsTabType}
          />
        </div>
        <div>
          {active === HotelDetailsTabType.DETAILS ? (
            hotel?.details && <Content details={hotel?.details} />
          ) : !hotelRoomsLoading ? (
            <>
              <Rooms
                city={hotel?.details?.city}
                hotelRooms={hotelRooms as THotelRooms}
                requestId={query?.requestId?.toString() || ''}
                hotelRoomsLoading={hotelRoomsLoading}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
              />
            </>
          ) : (
            <div className="mt-5">
              <Spinner />
            </div>
          )}
          <RoomFooter
            selectedRoom={selectedRooms || {}}
            nights={hotelRooms?.nights as number}
            loading={createOrderIsLoading}
            handleClick={handleAddRoomsMobile}
            roomCount={roomsInfo.length}
          />
        </div>
      </div>
    </>
  ) : (
    <>
      {hotelRooms?.rooms?.length ? schema.hotel(hotel, hotelRooms?.rooms) : ''}
      {reportModalComponent}
      <HotelHeader hotel={hotel as THotelInfo} />
      <HotelDetailGallery
        hotel={hotel as THotelInfo}
        setVisibleGalleryModal={setVisibleGalleryModal}
      />
      <div className="row" ref={RoomsRef}>
        <div className={cn(styles['fixed-tab'], ' mb-4 mt-4 d-flex flex-row-reverse pt-3 ')}>
          {!similarHotelIsLoading &&
            tabBarItem.map((tab, index) => {
              if (
                (similarHotels?.list?.length === 0 && tab.id === 5) ||
                (hotel?.details?.reviews?.totalRate === 0 && tab.id === 6)
              ) {
                return;
              }
              return (
                <div
                  onClick={() => handleTabClick(tab.id)}
                  key={index.toString() + 'hotelDetails' + tab.id.toString()}
                  className={cn(
                    styles['fixed-tab__item'],
                    tab.isSelected ? 'color-primary' : '',
                    tab.isSelected && styles['fixed-tab__border'],
                    'cursor-pointer',
                  )}
                >
                  <div className="d-flex justify-content-center align-items-center w-100">
                    {tab.name}
                  </div>
                </div>
              );
            })}
        </div>
        {hotelRooms?.rooms?.length === 0 && !hotelRoomsLoading ? (
          <div className={styles['fullCapacity']}>
            <div className={styles['fullCapacity__btns']}>
              <HotelNotFound />
              <p>
                {' '}
                متاسفانه هتل درخواستی ظرفیت مورد نظر شما در تاریخ جستجو شده را ندارد، آیا تمایل به
                مشاهده ظرفیت در هتل های مشابه دارید ؟
              </p>
              <Button
                radius
                onClick={handleBackAndSearch}
                className={cn(styles['fullCapacity__btns--btn'], 'btn btn-primary')}
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
        {hotelRoomsLoading || (!hotelRoomsLoading && hotelRooms?.rooms?.length > 0) ? (
          <SumOfRooms
            dupHotelRooms={dupHotelRooms as THotelRooms}
            allDefined={allDefined}
            memoizedNewArray={memoizedNewArray}
            sumTotalPriceRooms={sumTotalPriceRooms}
            allUndefined={allUndefined}
            handleClick={handleAddRooms}
            createOrderIsLoading={createOrderIsLoading}
            hotelRoomsLoading={hotelRoomsLoading}
          />
        ) : null}
        <div className="col-8" style={{ width: '728px' }}>
          {hotelRoomsLoading ? (
            <div className="d-flex justify-content-center align-items-center w-100 h-100 ">
              <Spinner />
            </div>
          ) : null}
          {dupHotelRooms?.rooms &&
            dupHotelRooms?.rooms.map((ele, ind) => {
              const hasExtraBed = !!ele?.room?.roomInfo?.hasExtraBed;
              return (
                <div
                  className={cn(
                    styles['rooms'],
                    ele?.selected && 'bg-color-blue-light-4',
                    'mb-2 card p-3 ',
                  )}
                  key={ind.toString() + 'detailsModuleHotel'}
                >
                  <div
                    style={{ height: '160px' }}
                    className={cn('d-flex flex-row-reverse justify-content-between')}
                  >
                    <div className="d-flex flex-column justify-content-between align-items-end h-100 ">
                      <div>
                        <div className="d-flex align-items-center pb-3 text-4 rtl text-weight-500">
                          {ele?.room?.roomInfo?.name}
                        </div>
                        <div className="d-flex flex-row-reverse flex-wrap mb-3 gap-1">
                          {ele?.room?.roomInfo.tagList.map((tag, index) => {
                            return (
                              <div
                                key={`tag-${index}`}
                                className={cn(styles['rooms__tagList'], 'text-2 pt-1 text-center')}
                              >
                                {tag}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {ele?.room?.roomInfo?.description ? (
                        <div className="rtl text-3 ">
                          <div
                            className="d-flex flex-row-reverse justify-content-between align-items-center"
                            onClick={() => handleRoomDetail(ele?.room?.roomId)}
                          >
                            <DownArrow />
                            <span className="ps-1 color-primary">توضیحات اتاق ها</span>
                          </div>
                          {openRoomModal === ele?.room?.roomId && (
                            <RoomDetailsModal
                              roomDetails={ele?.room?.roomInfo?.description}
                              setOpenModal={setOpenRoomModal}
                            />
                          )}
                          {hasExtraBed ? ' + سرویس اضافه' : ''}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="d-flex">
                      <div className={styles['rooms__border']}>
                        <div
                          style={{ marginRight: '24px' }}
                          className="d-flex justify-content-between align-items-center flex-column h-100"
                        >
                          <div className="pb-3 text-center text-4 text-weight-400">
                            قیمت برای {dupHotelRooms?.nights} شب
                          </div>
                          {ele?.room?.priceDetail?.price?.discountPercent &&
                            ele?.room?.priceDetail?.price?.discountPercent > '0' && (
                              <div className="d-flex">
                                <div className={styles['rooms__price__withDiscount']}>
                                  <span className="text-2">ریال</span>
                                  {Number(
                                    ele?.room?.priceDetail?.price?.priceAfterDiscount,
                                  )?.toLocaleString()}
                                </div>
                                <span
                                  className={classNames(
                                    styles['rooms__price__discount'],
                                    'd-flex justify-content-center align-items-center',
                                  )}
                                >
                                  تا %{ele?.room?.priceDetail?.price?.discountPercent}
                                  تخفیف
                                </span>
                              </div>
                            )}
                          <div className=" d-flex align-items-center justify-content-center text-4 text-weight-400 pt-1 text-center color-primary">
                            <span className="text-4  pe-1 ">ریال</span>
                            <div className="text-center text-6 text-weight-500">
                              {Number(ele?.room?.priceDetail?.price?.totalPrice)?.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <Button
                              btnType={'submit'}
                              className={cn(
                                styles['rooms__btn'],
                                ele?.selected && styles['rooms__btn--remove'],
                                // 'btn btn-primary button--radius mt-3',
                              )}
                              onClick={() => {
                                handleReserveRoom(ele, ind);
                              }}
                              radius
                            >
                              <div className="text-3">
                                {ele?.selected ? 'حذف اتاق' : 'رزرو اتاق'}
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{ width: '200px' }}
                          className="d-flex flex-column
                         text-3 align-items-start px-4"
                        >
                          <div className="d-flex flex-row-reverse">
                            <UserIcon />
                            <span className="pt-1 pe-2">{ele?.room?.roomInfo?.capacity}</span>
                            <span className="pt-1 pe-1">نفر</span>
                            {hasExtraBed ? (
                              <>
                                <span className="pt-1 pe-1">1 +</span>
                                <span className="pt-1 pe-1">نفر اضافه</span>
                              </>
                            ) : null}
                          </div>
                          <div className="pt-3 d-flex flex-column gap-2">
                            {!ele.room?.roomInfo?.refundable ? (
                              <div className={styles['rooms__refundable']}>غیر قابل استرداد</div>
                            ) : (
                              <></>
                            )}
                            {ele.room?.roomInfo?.temporaryStay ? (
                              <div className={styles['rooms__refundable']}>اقامت موقت</div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {hotelRooms?.rooms?.length > 0 ? (
          <TypeOfRooms
            newArray={newArray}
            numberToPersianWorld={numberToPersianWorld}
            handleItemClick={handleItemClick}
            memoizedNewArray={memoizedNewArray}
          />
        ) : (
          <div></div>
        )}
        <AboutHotel aboutText={hotel?.details?.about?.aboutHotel} />
        {hotel?.details?.reviews &&
        hotel?.details?.reviews?.totalRate &&
        hotel?.details?.reviews?.totalRate > 0 ? (
          <>
            <div className="col-3"></div>
            <div ref={commentReview} style={{ overflowX: 'auto' }} className="col-9">
              <div className=" p-4 card mt-4">
                <Review data={hotel?.details?.reviews} hotelName={hotel?.details?.name} />
              </div>
            </div>
          </>
        ) : null}

        <RulesAndFacility
          hotel={hotel as THotelInfo}
          facilityRef={facilityRef}
          rulesRef={rulesRef}
          isInternational={hotel?.details?.isInternational}
        />
        <div ref={importantPlacesAndMap} className=" mt-4">
          <ImportantPlacesAndMap
            title={'موقعیت مکانی هتل'}
            location={hotel?.details?.location?.point}
            address={hotel?.details?.address}
            places={hotel?.details?.sightLocation?.map((item) => {
              return {
                name: item?.name,
                time: item?.time,
                distance: item?.distance,
              };
            })}
          />
        </div>
      </div>
      <div className=" mt-4 p-4">
        <SimilarHotels
          similarHotelsRef={similarHotelSRef}
          title={'هتل های مشابه'}
          containerStyles={{ width: '363px' }}
          titleStyle={{ fontSize: '1.25rem' }}
          data={similarHotels}
          isLoading={similarHotelIsLoading}
        />
      </div>
      <Modal visible={visibleGallery} onClose={() => setVisibleGalleryModal()}>
        <div className={cn(styles['parent-modal'], 'bg-white p-4')}>
          <div
            className={cn(
              styles['modal-header'],
              'd-flex flex-row-reverse justify-content-between align-items-center pb-3',
            )}
          >
            <div className="d-flex flex-row align-items-center">
              <div className="pe-2 text-black color-black text-weight-500">
                گالری تصاویر هتل {hotel?.details?.name}
              </div>
              <GalleryIcon />
            </div>
            <div className="cursor-pointer" onClick={() => setVisibleGalleryModal()}>
              <CloseIcon style={{ transform: 'scale(1.3)' }} />
            </div>
          </div>
          <div className="col-12 pt-3 d-flex justify-content-center align-items-center">
            {hotel?.details?.images && (
              <div className="position-relative w-100">
                <div
                  style={{ zIndex: 1 }}
                  className="position-absolute h-100 w-100  d-flex justify-content-between align-items-center "
                >
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      imageIndex > 0 && setImageIndex((prev) => prev - 1);
                    }}
                    className="mx-3"
                  >
                    <SliderLeft />
                  </div>
                  <div
                    role="button"
                    onClick={(e) => {
                      if (imageIndex < hotel?.details?.images?.length - 1) {
                        e.stopPropagation();
                        setImageIndex((prev) => prev + 1);
                      }
                    }}
                    className="mx-3"
                  >
                    <SliderRight />
                  </div>
                </div>
                <div>
                  <Image
                    className={cn(
                      styles['parent-big-image'],
                      isShowReportImageEffect && styles['blur-effect'],
                    )}
                    src={`${hotel?.details?.images[imageIndex]}`}
                    alt="no filter found"
                    width="960"
                    height="500"
                    unoptimized
                  />
                  {isShowReportImageEffect && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '50%',
                      }}
                    >
                      <EyeIcon />
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      setImageSelected(`${hotel?.details?.images[imageIndex]}`);
                      if (!login) {
                        setLoginModalVisible(true);
                        setAccessOpenReportModal(true);
                        return;
                      }
                      setVisibleGalleryModal();
                      e.stopPropagation();
                      setOpenReportModal(true);
                    }}
                    className={cn(styles['report-button'], 'cursor-pointer')}
                  >
                    گزارش مشکل
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className={cn(styles['scroll'])}>
            {hotel?.details?.images?.map((ele, ind) => {
              return (
                <div
                  onClick={() => {
                    onSelectImage(ind);
                  }}
                  key={ind.toString() + 'moduleDetailHotel'}
                  className={cn(styles['image-item'], 'col-3 d-inline-block p-2 cursor-pointer')}
                >
                  <div
                    className={cn(
                      imageIndex == ind ? styles['image-selected'] : styles['parent-big-image'],
                    )}
                  >
                    <Image
                      className={cn(styles['parent-big-image'])}
                      // loader={() => hotel?.details?.images[0]}
                      src={ele}
                      // layout="fill"
                      alt="no filter found"
                      width="252"
                      height="170"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HotelInfo;
