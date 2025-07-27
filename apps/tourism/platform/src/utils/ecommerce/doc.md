# Ecommerce folder

## Application folder

All implemetation of ecommerce services put on this folder

## Domain folder

All abstract models and core types are organized within this folder.

## ErrorHandeling.ts file

Ecommerce error handeling can find here. For now it capture errors for sentry

## googleTagManager.ts file

The code below duty is crating dataLayer object and push events models on that
for google tag manager usage

```ts
export const createTrackingEvent = (params: ITrackEventParams, optional?: object) => {
  const { value, type } = params;

  if (typeof window !== 'undefined') {
    window.dataLayer = window?.dataLayer || [];
    const eventParams: { [key: string]: unknown } = {
      ecommerce: {
        ...optional,
        items: Array.isArray(value) ? value : [value],
      },
      event: type,
    };
    window?.dataLayer?.push(eventParams);
    window?.dataLayer?.push(resetEventParams());
  }

  return;
};
```
