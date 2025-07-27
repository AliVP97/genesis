import { components } from 'types/international-flight';
import { z } from 'zod';

const typeSchema = z
  .object({
    id: z.string(),
    title: z.string(),
  })
  .optional();

const locationSchema = z.object({
  value: z.string(),
  city: z.string(),
  type: typeSchema,
  data: z.record(z.string(), z.string()).optional(),
});

const passengersSchema = z.object({
  adult: z.number(),
  child: z.number(),
  infant: z.number(),
});

type CabinType = components['schemas']['InternationalFlightPb.CabinType'];

const cabinTypes = [
  'CABIN_TYPE_UNDEFINED',
  'CABIN_TYPE_ECONOMY',
  'CABIN_TYPE_PREMIUM',
  'CABIN_TYPE_BUSINESS',
  'CABIN_TYPE_FIRST',
] as CabinType[];

// Non empty tuple to ensure the zod enum has a not empty tuple and at least one element
const cabinTypeSchema = z.enum(cabinTypes as [CabinType, ...CabinType[]]);

const internationalFlightSearchSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  passenger: passengersSchema,
  departureDate: z.string(),
  returningDate: z.string().optional(),
  cabinType: cabinTypeSchema,
  calendarSystem: z.string().optional(),
  sort: z.string().optional(),
});

const internationalFlightSearchesSchema = z.array(internationalFlightSearchSchema);

export type InternationalFlightSearch = z.infer<typeof internationalFlightSearchSchema>;

/**
 * Retrieves the last search for international flights from the browser's local storage.
 *
 * @returns {InternationalFlightSearch[] | undefined} The last search for international flights, or `undefined` if no search data is found.
 */
export default function getLastInternationalFlightSearches():
  | InternationalFlightSearch[]
  | undefined {
  const rawData =
    typeof window !== 'undefined' && localStorage?.getItem('international_flight_last_search');
  let lastSearches: InternationalFlightSearch[] = [];

  if (!rawData) {
    return;
  }

  try {
    lastSearches = JSON.parse(rawData);
  } catch (error) {
    return;
  }

  return internationalFlightSearchesSchema.safeParse(lastSearches)?.data;
}
