import moment from 'moment-jalaali';

export const removeEmptyProperty = (obj: Record<string, unknown>): Record<string, unknown> => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || (obj[propName] as []).length < 1) {
      delete obj[propName];
    }
  }
  return obj;
};

export const shouldArray = (value: number | number[] | undefined): string[] | undefined => {
  if (typeof value === 'number') {
    return [value.toString()];
  }
  if (typeof value !== 'undefined' && value.length > 1) {
    return value.map((el) => el.toString()) as string[];
  }
};

export const convertFilterParams = (params: Record<string, number>) => {
  return {
    airlines: shouldArray(params?.airlines),
    stops: shouldArray(params?.airlines),
  };
};

/** Removes duplicated objects from an array, based on the given key. */
/* export const removeDuplications = (
  arr: {[key: string]: any}[],
  key: string,
) => {
  function onlyUnique(
    value: {[key: string]: any},
    index: number,
    self: typeof arr,
    key: string,
  ) {
    const tracedValue = value[key];
    return self.map(e => e[key]).indexOf(tracedValue) === index;
  }
  return arr.filter((v, i, s) => onlyUnique(v, i, s, key));
}; */
export type RemoveDuplicationsArrayMemberType = { [key: string]: string };
export const removeDuplications = (arr: RemoveDuplicationsArrayMemberType[], key: string) => {
  function onlyUnique(
    value: RemoveDuplicationsArrayMemberType,
    index: number,
    self: typeof arr,
    key: string,
  ) {
    const tracedValue = value[key];
    return self.map((e) => e[key]).indexOf(tracedValue) === index;
  }
  return arr.filter((v, i, s) => onlyUnique(v, i, s, key));
};

// WARNING - Rename to "UpdateQueryPropertyType" later.
export type UpdateQuery2PropertyType = {
  id: string;
  value: string;
  type: 'single' | 'pair' | 'multiple';
};
// WARNING - Rename to "UpdateQueryQueryType" later.
export type UpdateQuery2QueryType = { [key: string]: string | undefined };
// WARNING - Rename to "updateQuery" later.
/** Updates the given query based on the given property. */
export const updateQuery2 = (query: UpdateQuery2QueryType, property: UpdateQuery2PropertyType) => {
  let resultQuery = { ...query };
  const id = property.id;
  const value = property.value;
  switch (property.type) {
    case 'single': {
      // let resultValue = !query[id] || query[id] !== value ? value : undefined;
      const resultValue = !query[id] || query[id] !== value ? value : undefined;
      resultQuery = { ...resultQuery, [id]: resultValue };
      break;
    }
    case 'pair': {
      // let resultValue = !query[id] ? value : undefined;
      const resultValue = !query[id] ? value : undefined;
      resultQuery = { ...resultQuery, [id]: resultValue };
      break;
    }
    default:
      if (!query[id]) resultQuery = { ...resultQuery, [id]: value };
      else {
        const queryPropertyValues = query[id]?.split(',');
        const updatedQueryPropertyValues = queryPropertyValues?.includes(value)
          ? queryPropertyValues.filter((queryValue) => queryValue !== value)
          : [...(queryPropertyValues as []), value];
        resultQuery = {
          ...resultQuery,
          [id]: updatedQueryPropertyValues?.join(',') || undefined,
        };
      }
  }
  return resultQuery;
};

export type QueryType = {
  [key: string]: string | undefined;
};

/**
 * - Converts query object to query styring.
 * - Excludes "id" key.
 */
export const queryToQueryString = (query: QueryType) => {
  let result = '';
  for (const key in query) {
    key !== 'id' && query[key] && (result += key + '=' + query[key] + '&');
  }
  return result.slice(0, -1);
};

export const detectDevice = () => {
  let device = '';
  if (typeof window !== 'undefined') device = window.innerWidth < 768 ? 'mobile' : 'desktop';
  return device;
};

export const detectBreakpoint = () => {
  const w = window.innerWidth;
  return w < 576 ? 'xs' : w < 768 ? 'sm' : w < 992 ? 'lg' : w < 1200 ? 'xl' : 'xxl';
};

// copied from 'containers\availableDate'
export const getTimeStampFromDashedJalali = (date: string) => {
  return new Date(
    moment((date as string)?.split('-').join('/'), 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
  ).setHours(0, 0, 0, 0);
};
