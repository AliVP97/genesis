import { PopoverProps } from '../Popover';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import setPopoverPosition from '../utils/setPopoverPosition';
import AnchorOrigin from '../types/AnchorOrigin';

const handleMouseEnter =
  (
    anchorEl: HTMLElement,
    setVisible: Dispatch<SetStateAction<boolean>>,
    anchorOrigin: AnchorOrigin,
  ) =>
  () => {
    setVisible(true);
    setPopoverPosition(anchorEl, anchorOrigin);
  };

const handleMouseLeave = (setVisible: Dispatch<SetStateAction<boolean>>) => () => {
  setVisible(false);
};

export default function usePopover({ anchorEl, anchorOrigin }: PopoverProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!anchorEl) {
      return;
    }

    const mouseEnterHandler = handleMouseEnter(anchorEl, setVisible, anchorOrigin);
    const mouseLeaveHandler = handleMouseLeave(setVisible);

    anchorEl.addEventListener('mouseenter', mouseEnterHandler);
    anchorEl.addEventListener('mouseleave', mouseLeaveHandler);

    return () => {
      anchorEl.removeEventListener('mouseenter', mouseEnterHandler);
      anchorEl.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, [anchorEl, anchorOrigin]);

  return { visible };
}
