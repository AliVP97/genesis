## Custom Hook: `useSyncSearchParams`

Custom hook that synchronizes search parameters with the application state.

### Dependencies

This hook uses the following custom hooks:

- `useIataCodes`: Retrieves IATA codes and types for origin and destination.
- `useSearchLocation`: Fetches location data based on IATA codes and types.

### Actions

The hook performs the following actions:

1. Retrieves IATA codes and types for origin and destination using
   `useIataCodes`.
2. Fetches location data based on the retrieved IATA codes and types using
   `useSearchLocation`.
3. Uses a state variable `status` to track the status of the data fetching
   process.
4. Dispatches an action `searchLocationsChanged` to update the application state
   with the fetched location data.

### Returns

- **status**: The current status of the data fetching process (`'idle'` or
  `'success'`).

## Example Usage

```javascript
import useSyncSearchParams from './useSyncSearchParams';

const MyComponent = () => {
  const status = useSyncSearchParams();

  return (
    <div>
      {status === 'success' ? <p>Locations successfully synchronized!</p> : <p>Loading...</p>}
    </div>
  );
};

export default MyComponent;
```
