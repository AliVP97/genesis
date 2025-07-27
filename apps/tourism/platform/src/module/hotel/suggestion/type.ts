import { TGetHotelsResponse } from 'services/hotel/prepare/interface';

export type THotelSuggestion = Pick<TGetHotelsResponse, 'suggestions'>;
export type TSuggestionItem = NonNullable<NonNullable<TGetHotelsResponse['suggestions']>[number]>;

export type TPropertyCardProps = {
  image: string;
  title: string;
  rating: number;
  price: string;
  priceAfterDiscount: string;
  discountPercent: string;
  discount: string;
  tag: string;
  star: string;
  totalRate: string;
  reviewCount: string;
  requestId: string;
  hotelId: string;
  uuid: string;
};
