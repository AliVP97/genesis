import { components, ControlProps, GroupBase } from 'react-select';

import styles from './styles.module.scss';

export const Control = ({
  children,
  ...props
}: JSX.IntrinsicAttributes & ControlProps<unknown, boolean, GroupBase<unknown>>) => {
  return (
    <components.Control {...props}>
      {props.hasValue && (
        <span className={styles['control__label']}>{props.selectProps.placeholder}</span>
      )}
      {children}
    </components.Control>
  );
};
