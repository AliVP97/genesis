import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export type ServerSideValidatorResult = {
  isValid: boolean;
  correctRoute?: string;
  skipValidations?: boolean;
  props?: Record<string, unknown>;
  correctQuery?: Record<string, string>;
};

export type ServerSideContext<
  Query = Record<string, string>,
  Params = Record<string, string>,
> = Omit<GetServerSidePropsContext, 'query' | 'params'> & {
  query: Query;
  params: Params;
};

export type ServerSideValidator<Value> = (value: Value) => ServerSideValidatorResult;

export type ServerSideValidatorWithContext<
  Query = Record<string, string>,
  Params = Record<string, string>,
> = (context: ServerSideContext<Query, Params>) => ServerSideValidatorResult;

export type HandlePageValidationResult<
  T extends Record<string, unknown> = Record<string, unknown>,
> = { isValid: true; props?: T } | { isValid: false; response: GetServerSidePropsResult<never> };

export type HandlePageValidationOptions = {
  sortedQueryKeys: string[];
};

/**
 * This is a sample type definition for your CMS data. which is consider data
 * to generate landing page.
 */
export type CMSData = {
  // should be implemented
};
