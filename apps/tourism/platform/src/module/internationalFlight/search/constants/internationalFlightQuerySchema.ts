import { z } from 'zod';
import dayjs from 'dayjs';

const internationalFlightQuerySchema = z.object({
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .default(dayjs().calendar('jalali').format('YYYY-MM-DD')),
  returningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  cabinType: z
    .string()
    .transform((value) => value.toUpperCase())
    .refine((value) =>
      [
        'CABIN_TYPE_UNDEFINED',
        'CABIN_TYPE_ECONOMY',
        'CABIN_TYPE_PREMIUM',
        'CABIN_TYPE_BUSINESS',
        'CABIN_TYPE_FIRST',
      ].includes(value),
    )
    .optional()
    .default('CABIN_TYPE_ECONOMY'),
  adult: z.string().regex(/^\d+$/).optional().default('1'),
  child: z.string().regex(/^\d+$/).optional().default('0'),
  infant: z.string().regex(/^\d+$/).optional().default('0'),
  originType: z.string().optional().default('1'),
  destinationType: z.string().optional().default('1'),
  tripMode: z.enum(['1', '2']).optional().default('1'),
  sort: z
    .enum(['lowPrice', 'earliestTime', 'recentTime', 'fast', 'price'])
    .optional()
    .default('fast'),
});

export default internationalFlightQuerySchema;
