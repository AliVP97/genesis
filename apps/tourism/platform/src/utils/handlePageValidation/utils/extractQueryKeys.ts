import { ParsedUrlQuery } from 'querystring';

const excludeParamsKeys = <Query extends ParsedUrlQuery, Params extends ParsedUrlQuery | undefined>(
  query: Query,
  params: Params,
) => {
  const excludedKeys = Object.keys(params ?? {});

  return Object.entries(query).reduce((acc, [key, value]) => {
    if (!excludedKeys.includes(key)) {
      acc[key as keyof Query] = value as Query[keyof Query];
    }

    return acc;
  }, {} as Query);
};

export default excludeParamsKeys;
