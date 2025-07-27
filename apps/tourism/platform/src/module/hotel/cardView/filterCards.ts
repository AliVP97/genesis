import { ParsedUrlQuery } from 'querystring';
import { THotelList } from 'services/hotel/prepare/interface';
import { definitions } from 'types/hotel';
export type THotelFacilities = definitions['apihotelFacilityType'];
export const filterCards = (hotelList: THotelList, query: ParsedUrlQuery) => {
  if (query.priceRange) {
    const queryPriceRange = (query.priceRange as string)
      .split(',')
      .map((priceRange) => +priceRange);
    hotelList = hotelList?.filter(
      (hotel) =>
        queryPriceRange[0] <= Number(hotel?.priceDetail?.totalPrice) &&
        Number(hotel?.priceDetail?.totalPrice) <= queryPriceRange[1],
    );
  }
  if (query.facilities) {
    const queryFacilities = (query.facilities as string).split(',');
    hotelList = hotelList?.filter((hotel) => {
      const facility = hotel.facility?.map((item) => item.type);
      return facility && queryFacilities.every((el) => facility.includes(el as THotelFacilities));
    });
  }
  if (query.type) {
    const queryTypes = (query.type as string).split(',');
    hotelList = hotelList?.filter((hotel) => {
      const type = hotel?.type;
      return queryTypes.includes('HOTEL') && type && type === 'HOTEL';
    });
  }
  if (query.stars) {
    const queryStars = (query.stars as string).split(',');
    hotelList = hotelList?.filter((hotel) => {
      const star = hotel.star;
      return (
        (queryStars.includes('0') && star && Number(star) < 4) ||
        (queryStars.includes('1') && star && Number(star) === 4) ||
        (queryStars.includes('2') && Number(star) === 5)
      );
    });
  }
  if (query.sort) {
    if (query.sort === 'lowPrice') {
      hotelList = hotelList?.sort(
        (a, b) => +a!.priceDetail!.totalPrice! - +b!.priceDetail!.totalPrice!,
      );
    } else if (query.sort === 'highPrice') {
      hotelList = hotelList?.sort(
        (a, b) => +b!.priceDetail!.totalPrice! - +a!.priceDetail!.totalPrice!,
      );
    } else if (query.sort === 'highScore') {
      hotelList = hotelList?.sort((a, b) => +b!.star! - +a!.star!);
    } else if (query.sort === 'lowScore') {
      hotelList = hotelList?.sort((a, b) => +a!.star! - +b!.star!);
    } else if (query.sort === 'offer') {
      hotelList = hotelList;
    }
  }
  const result = hotelList;
  return [...result!];
};
