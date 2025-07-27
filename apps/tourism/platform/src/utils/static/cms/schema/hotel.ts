import { definitions } from 'types/hotel';
import { SchemaElement } from '.';

const schmeaConstants = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
};
type HotelAddressModel = {
  '@type': string;
  streetAddress: string;
};
type HotelStarRatingModel = {
  '@type': string;
  ratingValue: string | undefined;
};
type hotelSchemaModel = {
  '@context': string;
  '@type': string;
  name: string;
  description: string | undefined;
  address: HotelAddressModel;
  telephone: string;
  photo: string | number[];
  starRating: HotelStarRatingModel;
  priceRange?: string;
};

export const hotelSchemaGenerator = (
  hotel: definitions['hotelHotelDetails'],
  hotelRooms: definitions['hotelRooms'][],
): JSX.Element => {
  try {
    const { name, about, address, phone, images, star } = hotel;
    const schema: hotelSchemaModel = {
      ...schmeaConstants,
      name: name ?? '',
      description: about?.aboutHotel ?? '',
      address: {
        '@type': 'PostalAddress',
        streetAddress: address ?? '',
      },
      telephone: phone ?? '',
      photo: images ? [0] : '',
      starRating: {
        '@type': 'Rating',
        ratingValue: `${star}`,
      },
    };

    hotelRooms.length !== 0
      ? (schema.priceRange = `${hotelRooms[0].room?.priceDetail?.price?.totalPrice}-${
          hotelRooms[hotelRooms.length - 1].room?.priceDetail?.price?.totalPrice
        }`)
      : null;

    return SchemaElement(schema);
  } catch (error) {
    return SchemaElement('');
  }
};

export default hotelSchemaGenerator;
