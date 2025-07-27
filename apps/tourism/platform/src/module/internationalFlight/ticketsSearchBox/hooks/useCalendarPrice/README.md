# useCalendarPrice

This hook is used to get the calendar price of the flight. It mean to get the
price of the flight for each day in the calendar. The data will gather from the
mobile and desktop calendar which both have the different data structure and
behavior.

## Arguments

| Name     | Type       | Description                                             |
| -------- | ---------- | ------------------------------------------------------- |
| location | `Location` | the location which is considered origin and destination |
| enabled  | `boolean`  | the state to know when this hook should be enabled      |

## Return

daysContents, handleMonthChange,

| Name              | Type                | Description                             |
| ----------------- | ------------------- | --------------------------------------- |
| daysContents      | `Array<DayContent>` | the data of the calendar                |
| handleMonthChange | `Function`          | the function to handle the month change |
