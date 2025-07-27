import { RoundedButtonStateType } from 'components/roundedButton/types';

export type MultiSelectButtonsStateMemberType = RoundedButtonStateType;

export type MultiSelectButtonsStateType = MultiSelectButtonsStateMemberType[];

export type MultiSelectButtonsChangeEventType = {
  name: string;
  state: MultiSelectButtonsStateType;
};

export type MultiSelectButtonsOnChangeType = (e: MultiSelectButtonsChangeEventType) => void;

export type MultiSelectButtonsPropsType = {
  state: MultiSelectButtonsStateType;
  onChange: MultiSelectButtonsOnChangeType;
};
