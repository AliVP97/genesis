export type RoundedButtonStateType = {
  title: string;
  value: string;
  isSelected: boolean;
};

export type RoundedButtonChangeEventType = {
  name: string;
  state: RoundedButtonStateType;
};

export type RoundedButtonOnChangeType = (e: RoundedButtonChangeEventType) => void;

export type RoundedButtonPropsType = {
  state: RoundedButtonStateType;
  onChange: RoundedButtonOnChangeType;
};
