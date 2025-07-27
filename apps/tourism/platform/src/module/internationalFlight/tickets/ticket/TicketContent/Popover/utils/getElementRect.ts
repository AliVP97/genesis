import ElementRect from '../types/ElementRect';

export default function getElementRect(element: HTMLElement): ElementRect {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  return {
    height: rect.height,
    width: rect.width,
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}
