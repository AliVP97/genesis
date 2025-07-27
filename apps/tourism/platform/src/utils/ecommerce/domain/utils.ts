import { ParsedUrlQuery } from 'querystring';

export const sanitizeText = (text: string): string | undefined => {
  const isInvalid =
    !text || text === 'undefined' || text === 'undefined-undefined' || text?.trim() === '';

  return isInvalid ? undefined : text;
};

export const generateItemListName = (text: Array<string>): string => {
  return text
    .map((item) => sanitizeText(item))
    .filter((item) => item !== undefined)
    .join('-');
};

export const checkPassengerCount = (query: ParsedUrlQuery, key: string): number => {
  return query.hasOwnProperty(key) ? parseInt(query[key] as string) : 0;
};
export const totalPassenger = (query: ParsedUrlQuery) => {
  const adault = checkPassengerCount(query, 'adult');
  const child = checkPassengerCount(query, 'child');
  const infant = checkPassengerCount(query, 'infant');
  return adault + child + infant;
};
