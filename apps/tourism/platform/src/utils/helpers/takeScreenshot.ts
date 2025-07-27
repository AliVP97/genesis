import { RefObject } from 'react';
import html2canvas, { Options } from 'html2canvas';

export const takeScreenShot = (
  node: RefObject<HTMLElement>,
  options: Partial<Options> = {
    width: (node.current as HTMLElement).offsetWidth,
    height: (node.current as HTMLElement).clientHeight,
    useCORS: true,
    allowTaint: true,
  },
) => {
  if (!node) {
    throw new Error('You should provide correct html node.');
  }

  return html2canvas(node.current as HTMLElement, {
    width: (node.current as HTMLElement).offsetWidth,
    height: (node.current as HTMLElement).clientHeight,
    useCORS: true,
    allowTaint: true,
    ...options,
  })
    .then((canvas) => {
      return canvas;
    })
    .catch((error) => console.error(error));
};
