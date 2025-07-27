# Method Introduction

## Method Name

Flat Segments

## Method Description

Flatten both returning and leaving flight segments for using in filter. flattens
segments of flight data to get all segments of flight data from

## Method Parameters

| Parameter Name | Parameter Type | Parameter Description                                         |
| -------------- | -------------- | ------------------------------------------------------------- |
| itinerary      | `ItineraryV2`  | The itinerary object from availability web services response. |

## Method Return Value

A flatten segments object form `FlightSegmentV2` type which is existed in
amiability web services response.

## Method Example

```ts
const result = flatSegments(itinerary);
console.log(result); // including both returning and leaving flight segments
```
