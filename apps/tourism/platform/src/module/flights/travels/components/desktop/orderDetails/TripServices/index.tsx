import { ReactNode } from 'react';

type TripsServicesProps = {
  show: boolean;
  Component: ReactNode;
}[];

const TripServices = ({ data }: { data: TripsServicesProps }) => {
  const foundItem = data.find((item) => item.show);

  return foundItem ? <>{foundItem.Component}</> : <></>;
};

export default TripServices;
