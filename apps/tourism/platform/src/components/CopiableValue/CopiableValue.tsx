import { FC, HTMLAttributes, MouseEventHandler, useState } from 'react';
import classNames from 'classnames';

import { copyToClipboard } from 'utils/helpers/copyToClipboard';
import { CopyOutline } from 'assets/icons';

import styles from './style.module.scss';

type TCopiableValueProps = {
  value?: string;
  iconElementProps?: HTMLAttributes<SVGElement>;
} & HTMLAttributes<HTMLDivElement>;

export const CopiableValue: FC<TCopiableValueProps> = ({
  value,
  className,
  onClick: onClickProp,
  children,
  iconElementProps,
  ...props
}) => {
  const [allowCopy, setAllowCopy] = useState(true);

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    onClickProp && onClickProp(e);

    if (allowCopy && !!value) {
      copyToClipboard(value);
      setAllowCopy(false);

      setTimeout(() => {
        setAllowCopy(true);
      }, 2500);
    }
  };

  return (
    <div
      className={classNames(styles['container'], value && styles['--with-value'], className)}
      onClick={onClick}
      {...props}
    >
      {value && <CopyOutline {...iconElementProps} data-html2canvas-ignore="true" />}
      {children}
    </div>
  );
};
