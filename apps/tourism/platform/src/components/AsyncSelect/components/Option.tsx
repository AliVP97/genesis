import { SingleValue, OptionProps, GroupBase, components, MultiValue } from 'react-select';

import styles from './styles.module.scss';

type TOptionSingleValue = SingleValue<{ label: string; value: string }>;

export const SingleValueOption = (
  props: JSX.IntrinsicAttributes &
    OptionProps<TOptionSingleValue, boolean, GroupBase<TOptionSingleValue>>,
) => {
  return (
    <components.Option {...props} className={styles['option']}>
      <label className={styles['option__label']}>{props.label}</label>
    </components.Option>
  );
};

type TOptionMultiValue = MultiValue<{ label: string; value: string }>;

export const MultiValueOption = (
  props: JSX.IntrinsicAttributes &
    OptionProps<TOptionMultiValue, boolean, GroupBase<TOptionMultiValue>>,
) => {
  return (
    <components.Option {...props} className={styles['option']}>
      <input
        className={styles['option__input']}
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
      />{' '}
      <label className={styles['option__label']}>{props.label}</label>
    </components.Option>
  );
};
