import { cloneDeep } from 'lodash';
import { RoundedButtonChangeEventType } from 'components/roundedButton/types';
import { RoundedButton } from 'components/roundedButton';
import { MultiSelectButtonsPropsType, MultiSelectButtonsStateMemberType } from './types';

const MultiSelectButtons = ({ state, onChange }: MultiSelectButtonsPropsType) => {
  const handleChange = (e: RoundedButtonChangeEventType) => {
    const newState = cloneDeep(state);
    const newStateNewMemberIndex = newState.indexOf(
      newState.find((m) => m.value === e.state.value) as MultiSelectButtonsStateMemberType,
    );
    newState[newStateNewMemberIndex] = e.state;
    onChange({ name: 'multiSelectButtons', state: newState });
  };

  return (
    <>
      {state.map((stateMember) => (
        <RoundedButton
          key={stateMember.value}
          state={stateMember}
          onChange={(e) => {
            handleChange(e);
          }}
        />
      ))}
    </>
  );
};

export { MultiSelectButtons };
