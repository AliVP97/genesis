import { z } from 'zod';
import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';
import { camelCase } from 'lodash';
dayjs.extend(jalaliday);

const strictFormatDate = (value: string) => {
  const convertedValue = dayjs(value, { jalali: true }).calendar('jalali').format('YYYY-MM-DD');

  if (value !== convertedValue) {
    return convertedValue;
  }
  return value;
};

export const busSearchQuerySchema = z.object({
  id: z.string().regex(/^[a-z_]+-[a-z_]+$/),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .transform(strictFormatDate)
    .refine((value) => {
      const today = dayjs().startOf('day');
      const date = dayjs(value, { jalali: true });

      return !date.isBefore(today);
    })
    .catch(dayjs().calendar('jalali').format('YYYY-MM-DD')),
  sort: z
    .string()
    .transform((value) => camelCase(value))
    .pipe(z.enum(['lowPrice', 'highPrice', 'earliestTime', 'recentTime']))
    .optional()
    .catch('earliestTime'),
});

export type TBusSearchQuery = z.infer<typeof busSearchQuerySchema>;
