import cn from 'classnames';
import styles from 'module/hotel/detail/details.module.scss';
import { Star } from 'assets/icons';
import Button from 'components/button';
import React from 'react';
import { THotelInfo } from 'services/hotel/hotelsAndCities/interface';
import { useRouter } from 'next/router';

interface IProps {
  hotel: THotelInfo;
}

export const HotelHeader = (props: IProps) => {
  const { hotel } = props;
  const router = useRouter();
  return (
    <div
      className={cn(
        styles['desktop-parent-image'],
        'd-flex row flex-row-reverse card p-4 bg-light mt-2',
      )}
    >
      <div className="col-9">
        <div className="d-flex flex-row justify-content-end align-items-center">
          <div className="d-flex flex-row justify-content-center align-items-center">
            <div className="pe-1 pt-1 color-orange text-weight-500 ">ستاره</div>
            <div className="pe-1 pt-1 color-orange text-weight-500 ">{`${hotel?.details?.star}`}</div>
            <Star />
          </div>

          <div className="text-weight-500 text-5 ps-2">{hotel?.details?.name}</div>
        </div>

        <div className="d-flex flex-row-reverse align-items-center pt-2 ">
          <span className="ps-2"> : آدرس</span>
          <span>{hotel?.details?.address?.substring(0, 91)}</span>
        </div>
      </div>
      <div className="col-3 d-flex justify-content-start align-items-center">
        <Button
          radius
          className="bg-light text-primary border border-primary pe-5 ps-5"
          onClick={() => {
            router.back();
          }}
        >
          بازگشت
        </Button>
      </div>
    </div>
  );
};
