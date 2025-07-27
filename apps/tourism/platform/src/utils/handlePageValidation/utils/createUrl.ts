import { ParsedUrlQuery } from 'querystring';

const sortQueryString = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  query: Query,
  sortedKeys: string[],
): Query => {
  const extraQuery = {} as Query;
  const sortedQuery = {} as Query;

  for (const key of sortedKeys) {
    if (query[key]) {
      sortedQuery[key as keyof Query] = query[key] as Query[string];
    }
  }

  for (const key in query) {
    if (!sortedKeys.includes(key)) {
      extraQuery[key as keyof Query] = query[key] as Query[string];
    }
  }

  return { ...sortedQuery, ...extraQuery };
};

export const createUrl = <Query extends ParsedUrlQuery = ParsedUrlQuery>(
  resolvedUrl: string,
  sortedQueryKeys: string[],
  route?: string,
  query?: Query,
) => {
  let url = resolvedUrl.split('?')[0];

  if (route) {
    url = url.split('/').slice(0, -1).join('/');
    url = `${url}/${route}`;
  }

  if (query) {
    query = sortQueryString(query, sortedQueryKeys);
    const queryString = Object.entries(query as Record<string, string>)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url = `${url}?${queryString}`;
  }

  return url;
};

export const getPathName = (resolvedUrl: string) => {
  const url = resolvedUrl.split('?')[0];

  return url.split('/').slice(0, -1);
};
