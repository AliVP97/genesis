# Flight Details

This component is used to display the flight details. In pwa this version is use
breakpoint to get correct layout and component which is developed for tablet and
mobile device.

## Component Props

| Prop Name       | Type                    | Description                               | Default Value |
| --------------- | ----------------------- | ----------------------------------------- | ------------- |
| requestId       | string                  | The request ID                            | -             |
| isLoading       | boolean                 | Whether the component is loading          | false         |
| hasSubmitButton | boolean                 | Whether the component has a submit button | false         |
| response        | ItineraryDetailResponse | The response object                       | -             |

## Component Usage

```jsx
<FlightDetails
  requestId="12345"
  isLoading={false}
  hasSubmitButton={true}
  response={{}} // Replace with actual response object
/>
```

## Global States

| State Name | Type   | Description     |
| ---------- | ------ | --------------- |
| requestId  | string | The request ID  |
| data       | object | The data object |

## Global Actions

| Action Name                         | Type    | Description                               |
| ----------------------------------- | ------- | ----------------------------------------- |
| flightRequestIdChanged              | string  | The request ID                            |
| flightDetailsDataChanged            | object  | The data object                           |
| flightDetailsHasSubmitButtonChanged | boolean | Whether the component has a submit button |
