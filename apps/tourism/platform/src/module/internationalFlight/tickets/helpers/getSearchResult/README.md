# Method Introduction

## Method Name

Get Search Result

## Method Description

Generates a search result from the provided itineraries and banners.

## Method Parameters

| Parameter Name | Parameter Type  | Parameter Description                                                              |
| -------------- | --------------- | ---------------------------------------------------------------------------------- |
| itineraries    | `ItineraryV2[]` | An array of `ItineraryV2` objects, or `undefined` if no itineraries are available. |
| banners        | `Banner[]`      | An array of `Banner` objects, or `undefined` if no banners are available.          |

## Method Return Value

A `SearchResult` array, which is a combination of the itineraries and banners.

## Method Example

```ts
const searchResult = getSearchResult(itineraries, banners);

if (searchResult[0].type === 'ticket') {
  // Do something with the ticket
} else if (searchResult[0].type === 'banner') {
  // Do something with the banner
}
```
