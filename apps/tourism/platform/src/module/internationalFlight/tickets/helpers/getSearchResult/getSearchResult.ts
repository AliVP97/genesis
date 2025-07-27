import { Banner, ItineraryV2 } from '../../types/api';
import { SearchResult } from '../../types/search';

/**
 * Generates a search result from the provided itineraries and banners.
 *
 * @param itineraries - An array of `ItineraryV2` objects, or `undefined` if no
 * itineraries are available.
 * @param banners - An array of `Banner` objects, or `undefined` if no banners
 * are available.
 * @returns A `SearchResult` array, which is a combination of the itineraries
 * and banners.
 */
export default function getSearchResult(
  itineraries: ItineraryV2[] | undefined,
  banners: Banner[] | undefined,
): SearchResult {
  if (!banners || !itineraries?.length) {
    return [];
  }

  const length = banners.length + itineraries.length;
  const result: SearchResult = [];
  let ticketIndex = 0;

  for (let i = 0; i < length; i++) {
    const bannerItem = banners?.find((banner) => banner.index === i + 1);

    if (bannerItem) {
      result[i] = { type: 'banner', data: bannerItem };
    } else {
      const itinerary = itineraries[ticketIndex++];

      if (!itinerary) {
        continue;
      }

      result[i] = { type: 'ticket', data: itinerary };
    }
  }

  return result;
}
