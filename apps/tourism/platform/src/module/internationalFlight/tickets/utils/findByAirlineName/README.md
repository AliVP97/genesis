# Method Introduction

## Method Name

Flat Segments

## Method Description

This function is responsible for filtering the airline names by passed flight
segment, operatingAirlineCode is checked as it existed in the dictionary if that
is OK then the result is true otherwise false.

## Method Parameters

| Parameter Name | Parameter Type      | Parameter Description                                                             |
| -------------- | ------------------- | --------------------------------------------------------------------------------- |
| dictionary     | `AirlineDictionary` | The dictionary from airline dictionary to find specific airline by its iata code. |
| flightSegment  | `FlightSegmentV2`   | The flight segment object from availability web services response.                |

## Method Return Value

A boolean value indicating whether the airline name is found in the dictionary
or not.

## Method Example

```ts
const result = findByAirlineName(airlineDictionary, flightSegment);
console.log(result); // true or false depending on the airline name existence.
```
