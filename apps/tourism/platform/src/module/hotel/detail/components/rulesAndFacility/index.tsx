import cn from 'classnames';
import styles from 'module/hotel/detail/details.module.scss';
import Image from 'next/image';
import { ArrowDownPrimary } from 'assets/icons';
import React, { LegacyRef, useState } from 'react';
import { THotelInfo } from 'services/hotel/hotelsAndCities/interface';
import { getTextDirection } from 'utils/helpers/textDirection';
interface IProps {
  facilityRef: LegacyRef<HTMLDivElement> | undefined;
  rulesRef: LegacyRef<HTMLDivElement> | undefined;
  hotel: THotelInfo;
  isInternational: boolean;
}

interface IFacility {
  name?: string;
  icon?: string;
}

export const RulesAndFacility = (props: IProps) => {
  const { facilityRef, rulesRef, hotel, isInternational } = props;
  const [showAllFacility, setShowAllFacility] = useState(false);

  return (
    <>
      <div className="col-3"></div>
      <div className=" col-9" ref={facilityRef}>
        <div
          className={cn(
            styles['ability'],
            ' pt-4 mt-3 d-flex justify-content-end w-100 text-black color-black text-weight-500 text-5 pb-2',
          )}
        >
          امکانات
        </div>
        <div className="card ps-3">
          <div className="row mt-3">
            {hotel?.details?.facility
              ?.slice(0, showAllFacility ? hotel?.details?.facility?.length : 11)
              .map((element: IFacility, index) => {
                const textDirection = getTextDirection(element?.name || '');

                return (
                  <div
                    key={index.toString() + element?.name + 'hotel'}
                    className="col-2 d-flex align-items-center pb-4 "
                  >
                    {!isInternational && (
                      <Image
                        src={element.icon as string}
                        width="17"
                        height="15"
                        alt={element?.name}
                      />
                    )}

                    <span dir={textDirection}>{element.name}</span>
                  </div>
                );
              })}
            {!showAllFacility && (
              <div
                ref={rulesRef}
                onClick={() => {
                  setShowAllFacility(!showAllFacility);
                }}
                className="d-flex align-items-center cursor-pointer color-primary pb-3"
              >
                <ArrowDownPrimary />
                <div className="ps-2">مشاهده کامل امکانات</div>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            ' pt-4 mt-3 d-flex justify-content-end w-100 text-black color-black text-weight-500 text-5 pb-2',
          )}
        >
          قوانین و مقررات
        </div>
        <div className="card">
          <div className="row flex justify-content-center">
            {/* <div className="col-10">
              <div className={'p-4 rtl'}>
                <div className={cn(styles['rules'], 'pe-4')}>
                  <p className={cn(showAllRules ? '' : style['truncate-text'])}>
                    {hotel?.details?.about?.aboutHotel}
                  </p>
                  {!showAllRules && (
                    <div
                      onClick={() => {
                        setShowAllRules(!showAllRules);
                      }}
                      className="d-flex flex-row-reverse  align-items-center cursor-pointer color-primary pb-3"
                    >
                      <ArrowDownPrimary />
                      <div className="ps-2">مشاهده کامل متن</div>
                    </div>
                  )}
                </div>
              </div>
            </div> */}

            <div className="d-flex flex-row-reverse p-4">
              <div className="d-flex flex-column col-6 align-items-end">
                <div>ساعت ورود</div>
                <div className="color-black-2 text-weight-500 text-5">
                  {hotel?.details?.checkTime?.checkIn}
                </div>
              </div>
              <div className="d-flex flex-column col-6">
                <div className="color-black-2 ">ساعت خروج</div>
                <div className="color-black-2 text-weight-500 text-5">
                  {hotel?.details?.checkTime?.checkOut}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            ' pt-4 mt-3 d-flex justify-content-end w-100 text-black color-black text-weight-500 text-5 pb-2',
          )}
        >
          قوانین کنسلی
        </div>
        <div dir="rtl" className="card p-3">
          {hotel?.details?.about?.cancellationRules?.map((element, index) => {
            return (
              <div
                key={index.toString() + element?.text}
                className={cn(
                  index == hotel?.details?.about?.cancellationRules?.length &&
                    styles['rules__cancellationRules'],
                  'd-flex flex-column justify-content-end align-items-start p-2',
                )}
              >
                <div className="color-red text-weight-500">{element.penalty}</div>
                <div className="pt-1 text-weight-400 text-4 color-grey-24">{element.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
