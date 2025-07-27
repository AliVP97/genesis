# Method Introduction

This method returns the last international flight searches and using `zod` to
get the data.

At this method while load data from `localStorage` to prevent any future errors
it wrapped in `try catch` and return `. So if data is not found it will return
any kind of error such as Sentry in a place that is used.

## Usage

```ts
import getLastInternationalFlightSearches from 'utils/helpers/getLastInternationalFlightSearches';
const lastSearches = await getLastInternationalFlightSearches();

if (lastSearches) {
  // do something with lastSearches
} else {
  // throw error
}
```

## Return

As a success response, it returns the last international flight searches. Which
is used in international flight pages.
