# Domain folder

## Reusable function on utils file:

- The code below aims to generate totalPassenger number based on query parameter
  (adult, child, infant) Because of reusability of this code we can put it here
  on domain.

```ts
export const checkPassengerCount = (query: ParsedUrlQuery, key: string): number => {
  return query.hasOwnProperty(key) ? parseInt(query[key] as string) : 0;
};
export const totalPassenger = (query: ParsedUrlQuery) => {
  const adault = checkPassengerCount(query, 'adult');
  const child = checkPassengerCount(query, 'child');
  const infant = checkPassengerCount(query, 'infant');
  return adault + child + infant;
};
```

- The code below working together for generating itemListName for data models.
  The sanitizeText function aim to filter/sanitize all nully values.

```ts
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
```

## Repository file

In this file, you’ll find all the repositories (function models) used for
events. If you need to add a new event for eCommerce, please create an events
interface for future use. notice: there is a room for refactoring this file.

## models file

All general models on ecommerce should define on this file

## constants file

All general constants on ecommerce should define on this file

## BaseActionType file

We put base type model for event tracking on this file, any new key for
dataLayers should put on this file.
