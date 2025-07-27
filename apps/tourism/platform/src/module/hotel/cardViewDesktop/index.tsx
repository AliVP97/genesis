import { THotelInfo } from 'services/hotel/prepare/interface';
import styles from 'module/hotel/cardView/components/hotelItem/style.module.scss';
import React from 'react';
import classNames from 'classnames';
import { MapPin, Star } from 'assets/icons';
import Button from 'components/button';
import Slider from 'module/hotel/detail/components/slider';
import { useRouter } from 'next/router';
import { HotelTrackingEvent } from 'utils/ecommerce/application/mappers/hotel/event';
import { hotelViewListItemModel } from 'utils/ecommerce/application/mappers/hotel/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { hotelDataObject } from 'store/slices/ecommerce/ecomerceSlice';
import { useReport } from '../detail/components/report/hooks/useReport';
import { useAuthContext } from 'utils/hooks/useAuthContext';

interface Props {
  hotels: THotelInfo;
  duration: number;
  isMobile: boolean;
  requestId: string | undefined;
  id: number;
  uuid: string;
}

export const CardViewDesktop = ({ hotels, duration, id, requestId, uuid }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { setOpenReportModal, setImageSelected, setAccessOpenReportModal } = useReport();
  const { login, setLoginModalVisible } = useAuthContext();

  const { hotelPassengersLength } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const callEcommerceSelectItemEvent = () => {
    const hotelEvent = new HotelTrackingEvent();

    const hotelModel: hotelViewListItemModel = {
      data: [hotels],
      query: router?.query,
      quantity: hotelPassengersLength,
      itemPosition: id,
    };
    dispatch(
      hotelDataObject({
        data: hotelModel,
      }),
    );
    hotelEvent.selectItem(hotelModel);
  };
  return (
    <div className="d-flex w-100">
      <div key={id} className={classNames(styles.hotel__desktop__card, 'p-3 mb-3 w-100')}>
        <div
          className={classNames(
            styles.hotel__dashed,
            'd-flex flex-column align-items-center justify-content-center ',
          )}
        >
          <div className="pb-2">شروع قیمت برای {duration} شب</div>
          {hotels?.priceDetail?.discountPercent != '0' && (
            <div className="d-flex">
              <div className={styles.hotel__pwa__footer__price__withDiscount}>
                <span className="text-2">ریال</span>
                {Number(hotels?.priceDetail?.totalPrice)?.toLocaleString()}
              </div>

              <span
                className={classNames(
                  styles.hotel__pwa__footer__price__discount,
                  'd-flex justify-content-center align-items-center',
                )}
              >
                تا %{hotels?.priceDetail?.discountPercent} تخفیف
              </span>
            </div>
          )}

          <div className=" d-flex align-items-center text-5 py-2 ">
            <span className="text-2 color-grey-1 pe-1">ریال</span>
            <div className="text-weight-500">
              {Number(hotels?.priceDetail?.totalPrice)?.toLocaleString()}
            </div>
          </div>
          {/*<Link*/}
          {/*  href={{*/}
          {/*    pathname: `/hotel/detail/${requestId}`,*/}
          {/*    query: {hotelId: hotels?.hotelId},*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <a target="_blank">*/}
          {/*    <>*/}
          {/*      <Button*/}
          {/*        btnType={'submit'}*/}
          {/*        className="btn btn-primary button--radius w-100"*/}
          {/*        radius*/}
          {/*      >*/}
          {/*        <div className="px-2 text-3">مشاهده جزییات و رزرو</div>*/}
          {/*      </Button>*/}
          {/*    </>*/}
          {/*  </a>*/}
          {/*</Link>*/}
          <Button
            btnType={'submit'}
            className="btn btn-primary button--radius w-100"
            onClick={() => {
              callEcommerceSelectItemEvent();
              router.push({
                pathname: `/hotel/${router?.query?.id}/${uuid}`,
                query: {
                  hotelId: hotels?.hotelId,
                  rooms: router?.query?.rooms,
                  requestId: requestId,
                },
              });
            }}
            radius
          >
            <div className="px-2 text-3">مشاهده جزییات و رزرو</div>
          </Button>
        </div>
        <div className="col-7">
          <div className="d-flex justify-content-end align-items-start flex-row ">
            <div className="ps-2 text-6 text-weight-500">{hotels.name}</div>
          </div>
          <div className="d-flex flex-row-reverse">
            {[...Array(Number(hotels.star))].map((_, index) => (
              <div className="me-1" key={index.toString() + 'hotelCardViewDesktop'}>
                <Star />
              </div>
            ))}
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center w-100 pt-2 text-3">
            <div className="pe-1">{hotels.address?.substring(0, 60)}</div>
            <MapPin />
          </div>
          <div className="d-flex flex-row justify-content-end align-items-center w-100 pt-2">
            <div className="pe-1">{hotels.description}</div>
            {/* <DoubleBed /> */}
          </div>
          {hotels?.facility?.length ? (
            <div className="d-flex flex-row justify-content-end pt-2 align-items-center">
              <div className="d-flex flex-row pe-1 justify-content-center align-items-center">
                {hotels?.facility.slice(0, 7)?.map((item, index) => (
                  <div
                    className={classNames(styles.hotel__pwa__facility)}
                    key={index.toString() + 'cardViewDesktopHotel'}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="text-2 d-flex justify-content-center align-items-center color-grey-24">
                : امکانات ویژه
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="w-25">
        <div key={id}>
          <Slider
            setAccessOpenReportModal={setAccessOpenReportModal}
            login={login}
            setLoginModalVisible={setLoginModalVisible}
            setOpenReportModal={setOpenReportModal}
            setImageSelected={setImageSelected}
            startPos="rtl"
            images={hotels?.images as Array<string>}
            title={''}
            dots={false}
          />
        </div>
      </div>
    </div>
  );
};
