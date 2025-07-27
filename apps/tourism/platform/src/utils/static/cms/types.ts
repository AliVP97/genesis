import { IFaqContent } from 'containers/landingPage/types';
import { ReactNode } from 'react';

export interface IContent {
  title: { body: ReactNode };
  description: { body: ReactNode };
}

export interface IFaq {
  answer_text: string;
  question: string;
  id: string;
}

export interface IRoute {
  id?: string | undefined;
  title: string;
  href?: string;
  content?: IContent;
  hide?: boolean;
  originFarsiName?: string;
  destinationFarsiName?: string;
}

export interface IBusyRoute {
  title: string;
  routes: Array<IRoute>;
}

export type StaticMetaDataProps = {
  serviceName: string;
  origin: string;
  destination: string | undefined;
};

export type TranslatorProps = {
  serviceName: string;
  iata: string | undefined;
};

export type ServiceStaticModel = {
  [key: string]: () => Array<IBusyRoute>;
};

export type ServiceFaqStaticModel = {
  [key: string]: () => IFaqContent[];
};
export type TranslatorModel = {
  [key: string]: string;
};

export const SERVICES = {
  bus: 'bus',
  flight: 'flights',
  train: 'train',
  international: 'international',
};
