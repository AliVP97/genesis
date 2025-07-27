import styles from './filterButton.module.scss';
import cn from 'classnames';
import { cloneDeep } from 'lodash';
import { RoundedButtonPropsType } from './types';

const RoundedButton = ({ state, onChange }: RoundedButtonPropsType) => {
  const handleChange = () => {
    const newIsSelected = !state.isSelected;
    let newState = cloneDeep(state);
    newState = { ...newState, isSelected: newIsSelected };
    onChange({ name: 'roundedButton', state: newState });
  };

  return (
    <div
      className={cn(
        styles['filterButton'],
        state.isSelected ? styles['filterButton--checked'] : '',
      )}
      onClick={handleChange}
    >
      <span>{state.title}</span>
    </div>
  );
};

export { RoundedButton };
