import { Banner, ItineraryV2 } from '../../types/api';
import getSearchResult from './getSearchResult';

describe('getSearchResult', () => {
  const banners: Banner[] = [
    {
      index: 1,
      desktopBannerSrc: '',
      mobileBannerSrc: '',
      title: '',
    },
    {
      index: 3,
      desktopBannerSrc: '',
      mobileBannerSrc: '',
      title: '',
    },
  ];
  const itineraries: ItineraryV2[] = [
    {
      itineraryId: '',
      currency: '',
      availableSeat: 0,
      priceInfo: {
        baseFare: undefined,
        tax: undefined,
        price: undefined,
        discountPrice: undefined,
        refundableTax: undefined,
        commission: undefined,
      },
      leavingFlight: {
        flightId: undefined,
        origin: undefined,
        destination: undefined,
        flightType: undefined,
        isReserveRequired: undefined,
        refundType: undefined,
        stopCount: undefined,
        duration: undefined,
        segments: undefined,
        stopDetail: undefined,
        flightBaggageDetail: undefined,
      },
      returningFlight: {
        flightId: undefined,
        origin: undefined,
        destination: undefined,
        flightType: undefined,
        isReserveRequired: undefined,
        refundType: undefined,
        stopCount: undefined,
        duration: undefined,
        segments: undefined,
        stopDetail: undefined,
        flightBaggageDetail: undefined,
      },
      IsCodeShare: false,
      cabinType: {
        cabinType: undefined,
        cabinTypeTitle: undefined,
      },
      tripMode: 0,
      flightType: '',
      isCharter: false,
      fareBreakdowns: [],
    },
    {
      itineraryId: '',
      currency: '',
      availableSeat: 0,
      priceInfo: {
        baseFare: undefined,
        tax: undefined,
        price: undefined,
        discountPrice: undefined,
        refundableTax: undefined,
        commission: undefined,
      },
      leavingFlight: {
        flightId: undefined,
        origin: undefined,
        destination: undefined,
        flightType: undefined,
        isReserveRequired: undefined,
        refundType: undefined,
        stopCount: undefined,
        duration: undefined,
        segments: undefined,
        stopDetail: undefined,
        flightBaggageDetail: undefined,
      },
      returningFlight: {
        flightId: undefined,
        origin: undefined,
        destination: undefined,
        flightType: undefined,
        isReserveRequired: undefined,
        refundType: undefined,
        stopCount: undefined,
        duration: undefined,
        segments: undefined,
        stopDetail: undefined,
        flightBaggageDetail: undefined,
      },
      IsCodeShare: false,
      cabinType: {
        cabinType: undefined,
        cabinTypeTitle: undefined,
      },
      tripMode: 0,
      flightType: '',
      isCharter: false,
      fareBreakdowns: [],
    },
  ];
  const bannersWithItineraries = getSearchResult(itineraries, banners);

  it('should return an empty array when no banners or itineraries are provided', () => {
    const result = getSearchResult(undefined, undefined);
    expect(result).toEqual([]);
  });

  it('should banner existed in correct index', () => {
    expect(bannersWithItineraries[2].type).toEqual('banner');
    expect(bannersWithItineraries[0].type).toEqual('banner');
  });

  it('should itinerary existed in correct index', () => {
    expect(bannersWithItineraries[1].type).toEqual('ticket');
    expect(bannersWithItineraries[3].type).toEqual('ticket');
  });

  it('should get all index of banner and itinerary', () => {
    expect(bannersWithItineraries.length).toEqual(banners.length + itineraries.length);
  });
});
