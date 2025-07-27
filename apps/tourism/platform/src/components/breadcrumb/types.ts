import { breadCrumbSchemaModel } from 'utils/static/cms/schema/breadcrumb';

export interface breadCrumbObjectModel {
  [key: string]: { fa: string };
}
export interface ServicesContsantModel {
  [key: string]: string;
}
export type TranslatorProps = {
  service: string;
  iata: string | undefined;
};
export type CityExtractorProps = {
  cityname: string;
  cityId: Array<string>;
};
export type TranslatorModel = {
  [key: string]: string;
};

export type breadCrumbModel = {
  breadCrumb: breadCrumbObjectModel | unknown;
  schema: breadCrumbSchemaModel | unknown;
};
