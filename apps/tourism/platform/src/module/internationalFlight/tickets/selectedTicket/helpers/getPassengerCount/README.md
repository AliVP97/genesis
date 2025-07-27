# Method Introduction

## Method Name

Get passenger count

## Method Description

Get count by fareBreakdowns data of order API

## Method Parameters

| Parameter Name | Parameter Type     | Parameter Description                                |
| -------------- | ------------------ | ---------------------------------------------------- |
| fareBreakdowns | `FareBreakdown2[]` | An array of `FareBreakdown2` objects, or `undefined` |

## Method Return Value

A sum of count in `fareBreakdowns` object.

## Method Example

```ts
const passengerCount = getPassengerCount(fareBreakdowns);

console.log(passengerCount);
```
