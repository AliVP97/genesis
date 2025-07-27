import { locationState } from 'components/originDestination/interface';
import { Location } from 'module/internationalFlight/search/types/common';

const createData = (location: Location): locationState['origin'] => ({
  value: location.iataCode,
  city: location.type === 'city' ? location.city : location.title,
  type: {
    id: location.type === 'city' ? 'ALL_AIRPORTS' : 'AIRPORT',
    title: location.type === 'city' ? 'همه فرودگاه‌ها' : location.iataCode,
  },
  data: { cityTitle: location.city },
  airport: '',
});

const createEmptyData = (): locationState['origin'] => ({
  value: '',
  city: '',
  airport: '',
  type: {
    id: '',
    title: '',
  },
  data: { cityTitle: '' },
});

const createLocationState = ({
  destination,
  origin,
}: {
  origin?: Location;
  destination?: Location;
}): {
  origin: locationState['origin'];
  destination: locationState['destination'];
} => ({
  origin: origin ? createData(origin) : createEmptyData(),
  destination: destination ? createData(destination) : createEmptyData(),
});

export default createLocationState;
