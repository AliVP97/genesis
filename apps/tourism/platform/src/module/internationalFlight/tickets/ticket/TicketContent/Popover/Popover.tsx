import React, { FC } from 'react';
import styles from './Popover.module.scss';
import cn from 'classnames';
import usePopover from './hooks/usePopover';
import { createPortal } from 'react-dom';
import { POPOVER_ID } from './utils/resources';
import AnchorOrigin from './types/AnchorOrigin';

export interface PopoverProps {
  anchorEl: HTMLElement | null;
  anchorOrigin: AnchorOrigin;
  className?: string;
}

const Popover: FC<PopoverProps> = ({ children, className, ...rest }) => {
  const { visible } = usePopover(rest);

  if (!visible) {
    return null;
  }

  return createPortal(
    <div
      id={POPOVER_ID}
      className={cn(
        'flex-column justify-content-center align-items-end position-absolute transition duration-200',
        styles.root,
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
};

export default Popover;
