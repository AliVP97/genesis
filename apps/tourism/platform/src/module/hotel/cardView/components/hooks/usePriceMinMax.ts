import { useMemo } from 'react';
import { THotelList } from 'services/hotel/prepare/interface';

export const usePriceMinMax = (hotelList: THotelList) => {
  const priceMinMax = useMemo(() => {
    if (!hotelList?.length) return { min: 0, max: 0 };
    const orderPrice = [...hotelList].sort(
      (a, b) => +a.priceDetail!.totalPrice! - +b.priceDetail!.totalPrice!,
    );

    return {
      min: Number(orderPrice[0]?.priceDetail!.totalPrice) || 0,
      max: Number(orderPrice[orderPrice!.length! - 1]?.priceDetail!.totalPrice) || 0,
    };
  }, [hotelList]);
  return {
    priceMinMax,
  };
};
