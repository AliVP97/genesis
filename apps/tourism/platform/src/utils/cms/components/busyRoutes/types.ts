import { ReactNode } from 'react';

export type BusyRoutesLinkProps = {
  id?: string;
  title?: string;
  link?: string;
  originFarsiName?: string;
  destinationFarsiName?: string;
  href?: string;
  hide?: boolean;
  content?: {
    title: { body: ReactNode };
    description: { body: ReactNode };
  };
};

export type BusyRouteItemProps = {
  id?: string;
  showLinks?: boolean;
  title?: string;
  originFarsiName?: string;
  destinationFarsiName?: string;
  image?: { url: string };
  link?: string;
  links?: Array<BusyRoutesLinkProps>;
};

export type BusyRoutesProps = {
  title?: string;
  items?: Array<BusyRouteItemProps>;
};
