# Method Introduction

## Method Name

Get query without filter keys

## Method Description

Get count by fareBreakdowns data of order API

## Method Parameters

| Parameter Name | Parameter Type | Parameter Description                           |
| -------------- | -------------- | ----------------------------------------------- |
| query          | `QueryType[]`  | An array of `QueryType` objects, or `undefined` |

## Method Return Value

An url without filter in query string.

## Method Example

```ts
// url with filter
const url =
  'http://localhost:3000/tourism/international/IKA-IST?adult=2&cabinType=CABIN_TYPE_ECONOMY&child=1&departureDate=1403-08-20&destinationType=0&infant=0&originType=0&sort=lowPrice&tripMode=1&priceRange=304840797,1210775000&departureDuration=2,33';

// url without filter
const rawUrl = getQueryWithoutFilter(url);

console.log(rawUrl); // https://api.staging.amadeus.com/v1/shopping/flight-offers?originLocationCode=LHR&destinationLocationCode=
```
