import { FC } from 'react';
import classNames from 'classnames';

import { definitions } from 'types/payment';

import styles from './DynamicButtons.module.scss';

type TDynamicButtonsProps = {
  data: definitions['paymentOrderReceiptResponse']['buttons'] | undefined;
  clickHandler: (type?: string, cta?: string) => void;
};

const getButtonClassName = (color?: string) => {
  const buttonClassMapper: Record<string, string> = {
    btn_blue: 'btn btn-primary',
    btn_white: 'btn btn-outline-primary',
  };

  if (color && buttonClassMapper[color]) {
    return buttonClassMapper[color];
  }

  return 'btn btn-primary';
};

export const DynamicButtons: FC<TDynamicButtonsProps> = ({ data, clickHandler }) => {
  return (
    <div className={styles['container']}>
      {data?.map(({ id, type, color, text, cta }) => (
        <button
          key={id}
          className={classNames(styles['button'], getButtonClassName(color))}
          onClick={() => {
            clickHandler(type, cta);
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
