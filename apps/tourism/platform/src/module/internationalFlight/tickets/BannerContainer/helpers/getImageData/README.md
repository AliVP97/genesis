# Method Introduction

## Method Name

Get Image Data

## Method Description

This method is used to get the image data for show in specified index in search
list.

## Method Parameters

| Parameter Name | Parameter Type | Parameter Description                                         |
| -------------- | -------------- | ------------------------------------------------------------- |
| banner         | Banner         | The banner object that contains the image data.               |
| elementWidth   | number         | The width of the element that the image will be displayed in. |

elementWidth: number,

## Method Return Value

A `ImageData` which contains the image data for show in specified index in
search list.

## Method Example

```ts
const imageData = getImageData(banner, elementWidth);
```
