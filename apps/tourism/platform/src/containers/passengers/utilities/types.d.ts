import { PassengerPayload } from 'services/general/passenger/interface';

interface FromSchema {
  name: string | string[];
  label: string;
  type: string;
  disabled?: boolean;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  defaultValue?: string | number | object | undefined | boolean;
  rules?: object;
  options?: Array<{ value: string; label: string }>;
  isJalali?: boolean;
  isEnMonthDaysFull?: boolean;
  visible: boolean;
  autoCompleteSource?: Record<string, string | number | object>[] | undefined;
  autoCompleteCondition?: (iteratedItem: PassengerPayload['body'], currentValue: string) => void;
  upperCase?: boolean;
}

type FromSchemaV2<T = string | string[]> = {
  name: T;
  timestampFieldName?: string;
  label: string;
  type: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  defaultValue?: string | number | object | undefined | boolean;
  rules?: object;
  options?: Array<{ value: string; label: string }>;
  isJalali?: boolean;
  isEnMonthDaysFull?: boolean;
  visiblity: 'all' | 'domestic' | 'foreign';
  autoCompleteSource?: Record<string, string | number | object>[] | undefined;
  autoCompleteCondition?: (iteratedItem: PassengerPayload['body'], currentValue: string) => void;
  upperCase?: boolean;
};

interface ISelectedCountry {
  countryAlpha2: string;
  value: string;
}
