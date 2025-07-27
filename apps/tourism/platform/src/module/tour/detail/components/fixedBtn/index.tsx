import SelectDate from '../selectDate';
import cn from 'classnames';
import Style from '../../style.module.scss';
import Button from 'components/button';
import React, { useEffect, useRef } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { TFixedBtn } from './typs';
import { ArrowLeftPrimaryColor } from 'assets/icons';
import { useRouter } from 'next/router';
import Skeleton from 'components/skeleton';

const FixedBtn = ({
  title,
  basePrice,
  calender,
  handleUpdateCalenderState,
  handleSubmitDate,
  defaultDate,
  localCalenderState,
  isLoading,
  isOpenBottomSheet,
  handleIsOpenBottomSheet,
  isOneDay,
  packageDateId,
  handleGoToCheckOut,
}: TFixedBtn) => {
  const { query } = useRouter();

  const calenderData = calender?.dates?.map((item) => {
    return {
      value: item.id,
      label: item.title,
    };
  });

  const platform = useRef<string | null | undefined>(null);
  useEffect(() => {
    platform.current = sessionStorage.getItem('platform');
  }, []);

  return (
    <div
      className={cn(
        Style.fixedBottom,
        platform.current === 'superapp' ? Style['fixedBottom--super-app'] : null,
        'w-100 p-3 pb-3',
      )}
    >
      {isOneDay ? (
        <div className="d-flex flex-column w-100 px-3">
          <div className="d-flex flex-row justify-content-between w-100 pb-4 pt-2">
            <div className="d-flex flex-row justify-content-center align-items-center">
              <ArrowLeftPrimaryColor />
              <div
                onClick={handleIsOpenBottomSheet}
                className="text-weight-500 fs-3 color-primary-surface ps-2"
              >
                انتخاب تاریخ تور
              </div>
            </div>
            <div dir={'rtl'} className="text-weight-500 fs-2 color-on-surface-var">
              {title}
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            <Button
              radius
              onClick={() =>
                handleGoToCheckOut(
                  query?.dateId ? (query?.dateId as string) : (packageDateId as string),
                )
              }
              className="bg-color-primary color-white rounded-3 px-4"
            >
              ثبت درخواست
            </Button>
            <div className="d-flex flex-column">
              <div className="text-weight-500 fs-2 color-on-surface-var">شروع قیمت از</div>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="pe-1 color-on-background fs-4 text-weight-400">ریال</div>
                <div className="color-on-surface fs-4 text-weight-400">
                  {basePrice && Number(basePrice).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column">
            <Button
              radius
              onClick={handleIsOpenBottomSheet}
              className="bg-color-primary color-white rounded-3 px-5"
            >
              انتخاب تاریخ
            </Button>
          </div>
          {isLoading ? (
            <Skeleton
              uniqueKey={'fixed'}
              type={'tourPdpTabBarItem'}
              width={170}
              height={50}
              className="pt-2"
            />
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="text-weight-500 fs-1 color-on-surface-var">شروع قیمت از</div>
                <div className="px-1 color-outline-var">|</div>
                <div dir={'rtl'} className="text-weight-500 fs-1 color-on-surface-var">
                  {title}
                </div>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center">
                <div className="pe-1 color-on-background text-weight-400">ریال</div>
                <div className="color-on-background fs-4 text-weight-400">
                  {basePrice && Number(basePrice).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <BottomSheet
        open={isOpenBottomSheet}
        onDismiss={handleIsOpenBottomSheet}
        snapPoints={({ maxHeight }) => (maxHeight * 0.3) / 1.1}
      >
        <div dir="rtl" className="px-3">
          <div className=" fs-4 text-weight-500 pt-3 pb-3">
            تاریخ تور مورد نظر خود را انتخاب کنید.
          </div>
          <SelectDate
            localCalenderState={localCalenderState}
            defaultDate={defaultDate}
            handleUpdateCalenderState={handleUpdateCalenderState}
            calenderData={calenderData}
          />
          <Button
            loading={isLoading}
            disabled={isLoading}
            onClick={handleSubmitDate}
            radius
            className="bg-color-primary color-white rounded-pill px-5 w-100"
          >
            تایید و انتخاب اقامتگاه
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
export default FixedBtn;
