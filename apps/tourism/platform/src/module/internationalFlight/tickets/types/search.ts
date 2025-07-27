import { Banner, ItineraryV2 } from './api';

export type SearchResult = (
  | { type: 'ticket'; data: ItineraryV2 }
  | { type: 'banner'; data: Banner }
)[];
