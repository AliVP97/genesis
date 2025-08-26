import * as z from 'zod';

import { repositoryFromSchema, RepositoryFromSchema } from '@780/utils';

export type Repository = RepositoryFromSchema<z.infer<typeof schema>>;

const schema = z.object({
  origin: z.string(),
  destination: z.string(),
  departureDate: z.string(),
  returnDate: z.string(),
  passengerType: z.object({
    name: z.string(),
    age: z.number(),
    gender: z.string(),
  }),
});

export const repository = repositoryFromSchema(schema);
