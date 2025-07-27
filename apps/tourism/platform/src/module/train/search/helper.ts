import { parse, stringify } from 'querystring';

import { trainSearchQuerySchema, trainSearchQueryBaseSchema, TTrainSearchQuery } from './utils';

export const trainSearchQuery = {
  baseSchema: trainSearchQueryBaseSchema,
  parse: trainSearchQuerySchema.parse,
  parseString: (query: string) => trainSearchQuerySchema.parse(parse(query)),
  stringify: (queryObject?: TTrainSearchQuery) =>
    stringify(trainSearchQuerySchema.parse(queryObject)),
};
