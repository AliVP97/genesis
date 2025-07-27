import { z } from 'zod';
import jmoment from 'moment-jalaali';

const domesticFlightQuerySchema = z.object({
  adult: z.string().regex(/^\d+$/).optional().default('1'),
  child: z.string().regex(/^\d+$/).optional().default('0'),
  infant: z.string().regex(/^\d+$/).optional().default('0'),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .default(jmoment().format('YYYY-MM-DD')),
  returningDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sort: z
    .enum(['lowPrice', 'earliestTime', 'recentTime', 'highPrice'])
    .optional()
    .default('lowPrice'),
});

export default domesticFlightQuerySchema;
