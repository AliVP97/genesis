import {
  RangeControlStateType,
  RangeControlStaticValuesType,
  RangeControlChangeEventType,
} from 'components/rangeControl';
import {
  MultiSelectButtonsStateType,
  MultiSelectButtonsChangeEventType,
} from 'components/multiSelectButtons/types';
import {
  CompaniesListStateType,
  CompaniesListChangeEventType,
} from 'containers/companiesList/types';

export type TicketsFilterComponentStateType =
  | RangeControlStateType
  | MultiSelectButtonsStateType
  | CompaniesListStateType;

// export type TicketsFilterSingleSelectComponentStateType = never;

export type TicketsFilterPairSelectComponentStateType = RangeControlStateType;

export type TicketsFilterMultipleSelectComponentStateType =
  | MultiSelectButtonsStateType
  | CompaniesListStateType;

export type TicketsFilterComponentChangeEventType =
  | RangeControlChangeEventType
  | MultiSelectButtonsChangeEventType
  | CompaniesListChangeEventType;

export type TicketsFilterStateMemberType = {
  id: string;
  title: string;
  component: {
    name: string;
    state: TicketsFilterComponentStateType;
    staticValues?: RangeControlStaticValuesType;
    showTotal?: boolean;
    showDropdown?: boolean;
  };
};

export type TicketsFilterStateType = TicketsFilterStateMemberType[];

export type TicketsFilterChangeEventType = {
  name: 'ticketsFilter';
  state: TicketsFilterStateType;
};

export type TicketsFilterOnChangeType = (e: TicketsFilterChangeEventType) => void;

export type TicketsFilterPropsType = {
  state: TicketsFilterStateType;
  onChange: TicketsFilterOnChangeType;
  length?: number;
};
