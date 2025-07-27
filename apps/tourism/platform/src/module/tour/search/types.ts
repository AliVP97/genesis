export type TActiveInput = 'datepicker' | 'passenger' | null;

export interface IElementCity {
  subTitle: string;
  title: string;
  description: string;
}
export interface IOrigin {
  origin: { value: string; city: string };
}
export interface IDestination {
  destination: { value: string; city: string };
}

export interface IDefaultData {
  value: IElementCity[];
  title?: string;
}
export interface ILocationResults {
  origin?: IElementCity[];
  destination?: IElementCity[];
}
export interface IDesktopSuggestionProps {
  activeInputName: string | undefined;
  mappedResults: IElementCity[] | 'empty list';
  defaultData: IDefaultData | undefined;
  handleOnSelectFrequency: (data: IElementCity, type: string) => void;
  results: ILocationResults | undefined;
  zone: 'origin' | 'destination';
}
export type TLocationType = {
  origin?: { value: string; city: string };
  destination?: { value: string; city: string };
};
// | {origin: {value: string; city: string}}
// | {destination: {value: string; city: string}}
