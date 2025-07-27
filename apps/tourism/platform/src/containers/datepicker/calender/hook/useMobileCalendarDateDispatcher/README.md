# useMobileCalendarDateDispatcher

## Description

This hook is used to dispatch the date while calendar is open on mobile devices
and each dates are considered whenever the user try to scroll the calendar.

## Arguments

| Argument       | Type                                 | Description                                                                                                                                                        |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| listRef        | `RefObject<(HTMLDivElement null)[]>` | the list of element to trace                                                                                                                                       |
| calendarSystem | CalendarSystem                       | The system used to calculate and display the calendar (e.g., Gregorian, Jalali, etc.). This is used to determine the correct date format when the date is changed. |
| dispatch       | AppDispatch                          | It dispatches the mobileSearchCalendarDateChanged action when a new visible date is found.                                                                         |

## Usage

```js
import { useRef } from 'react';
import useMobileCalendarDateDispatcher from 'path-to-hook';

const MyComponent = () => {
  const listRef = useRef([]);
  const calendarSystem = useAppSelector(selectSearchCalendarSystem);

  useMobileCalendarDateDispatcher(listRef);

  return <div ref={listRef}>{/* Calendar items go here */}</div>;
};
```

## Dispatcher in action

The `mobileSearchCalendarDateChanged` action is dispatched when a new visible
date is found. This action is used to update the state of the mobile calendar
and to display the correct date on the mobile calendar.

## Intersection Observer api

The `useMobileCalendarDateDispatcher` hook uses the `IntersectionObserver` API
to detect when a calendar item is visible on the screen.
