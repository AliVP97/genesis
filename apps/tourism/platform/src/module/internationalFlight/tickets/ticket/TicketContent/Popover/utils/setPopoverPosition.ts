import getElementRect from './getElementRect';
import AnchorOrigin, {
  AnchorHorizontal,
  AnchorOffset,
  AnchorVertical,
} from '../types/AnchorOrigin';
import { POPOVER_ID } from './resources';
import ElementRect from '../types/ElementRect';

const getOffset = (anchorOrigin: AnchorOrigin['offset']): AnchorOffset => ({
  left: anchorOrigin?.left ?? 0,
  right: anchorOrigin?.right ?? 0,
  top: anchorOrigin?.top ?? 0,
  bottom: anchorOrigin?.bottom ?? 0,
});

const getPopoverTop = (
  anchorRect: ElementRect,
  popoverRect: ElementRect,
  anchorOffset: AnchorOffset,
  vertical: AnchorVertical,
) => {
  switch (vertical) {
    case 'top':
      return anchorRect.top - popoverRect.height - anchorOffset.top;
    case 'center':
      return anchorRect.top + (anchorRect.height / 2 - popoverRect.height / 2) + anchorOffset.top;
    case 'bottom':
      return anchorRect.top + anchorRect.height - anchorOffset.bottom;
    default:
      return anchorRect.top + anchorOffset.top;
  }
};

const getPopoverLeft = (
  anchorRect: ElementRect,
  popoverRect: ElementRect,
  anchorOffset: AnchorOffset,
  horizontal: AnchorHorizontal,
) => {
  switch (horizontal) {
    case 'left':
      return anchorRect.left - popoverRect.width - anchorOffset.left;
    case 'center':
      return anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2 + anchorOffset.left;
    case 'right':
      return anchorRect.left + anchorRect.width + anchorOffset.right;
    default:
      return anchorRect.left + anchorOffset.left;
  }
};
export default function setPopoverPosition(anchorEl: HTMLElement, anchorOrigin: AnchorOrigin) {
  const popoverEl = document.getElementById(POPOVER_ID);

  if (!popoverEl) {
    return;
  }

  const anchorRect = getElementRect(anchorEl);
  const popoverRect = getElementRect(popoverEl);
  const anchorOffset = getOffset(anchorOrigin.offset);

  const top = getPopoverTop(anchorRect, popoverRect, anchorOffset, anchorOrigin.vertical);
  const left = getPopoverLeft(anchorRect, popoverRect, anchorOffset, anchorOrigin.horizontal);

  popoverEl.style.top = `${top}px`;
  popoverEl.style.left = `${left}px`;
}
