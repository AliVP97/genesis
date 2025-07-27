import { components, GroupBase, SingleValue, OptionProps, MenuProps } from 'react-select';

import styles from './Option.module.scss';

type TOptionSingleValue = SingleValue<{
  label: string;
  value: string;
  price: string;
}>;

export const SingleValueOption = (
  props: JSX.IntrinsicAttributes &
    OptionProps<TOptionSingleValue, boolean, GroupBase<TOptionSingleValue>>,
) => {
  return (
    <components.Option {...props} className={styles['option']}>
      <label className={styles['option__label']}>
        <span>{props.label}</span>
        {Number(props!.data?.price) ? (
          <span>{Number(props!.data?.price).toLocaleString()} ریال</span>
        ) : (
          ''
        )}
      </label>
    </components.Option>
  );
};

export const Menu = ({
  children,
  ...props
}: JSX.IntrinsicAttributes & MenuProps<unknown, boolean, GroupBase<unknown>>) => {
  return (
    <components.Menu {...props}>
      {children}
      <div className={styles['menu__footer']}>
        استفاده‌ی بی‌مورد از خدمات رایگان پیگرد قانونی دارد.
      </div>
    </components.Menu>
  );
};
