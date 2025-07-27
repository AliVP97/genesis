import classNames from 'classnames';
import { ValueContainerProps, GroupBase, components } from 'react-select';

import styles from './styles.module.scss';

export const ValueContainer = (
  props: JSX.IntrinsicAttributes & ValueContainerProps<unknown, boolean, GroupBase<unknown>>,
) => {
  return (
    <components.ValueContainer
      {...props}
      className={classNames(
        styles['value-container'],
        props.hasValue && styles['value-container--with-value'],
      )}
    />
  );
};
