import {
  ServerSideContext as ServerSideValidatorContext,
  ServerSideValidatorWithContext,
  HandlePageValidationResult,
  HandlePageValidationOptions,
} from '../types/common';
import { GetServerSidePropsContext } from 'next';
import { createUrl } from './createUrl';
import { createNotFoundResult, createRedirectResult } from './handlePageValidationResult';
import excludeParamsKeys from './extractQueryKeys';
import { ParsedUrlQuery } from 'querystring';

const handlePageValidation = <
  Query extends ParsedUrlQuery = ParsedUrlQuery,
  Params extends Record<string, string> = Record<string, string>,
>(
  context: GetServerSidePropsContext,
  validators: ServerSideValidatorWithContext<Query, Params>[],
  { sortedQueryKeys }: HandlePageValidationOptions,
): HandlePageValidationResult => {
  let route: string | undefined;
  let query: Query | undefined;
  const resolvedUrl = context.resolvedUrl;
  const { query: contextQuery, params: contextParams } = context as ServerSideValidatorContext<
    Query,
    Params
  >;
  const originalQuery = excludeParamsKeys<Query, Params>(contextQuery, contextParams);
  let newProps: Record<string, unknown> | undefined = undefined;

  for (const validator of validators) {
    const { isValid, correctQuery, correctRoute, skipValidations, props } = validator(
      context as ServerSideValidatorContext<Query, Params>,
    );

    if (props) {
      if (!newProps) {
        newProps = {};
      }

      newProps = { ...newProps, ...props };
    }

    if (!isValid) {
      return createNotFoundResult();
    }

    if (correctQuery) {
      if (!query) {
        query = {} as Query;
      }

      query = { ...originalQuery, ...correctQuery };
    }

    if (correctRoute) {
      route = correctRoute;
    }

    if (skipValidations) {
      break;
    }
  }

  if (route || query) {
    const url = createUrl<Query>(resolvedUrl, sortedQueryKeys, route, query);

    if (url !== resolvedUrl) {
      return createRedirectResult(url);
    }
  }

  return { isValid: true, props: newProps };
};

export default handlePageValidation;
