import { HTMLProps } from 'react';

type TDownloadFromLink = (attributes: HTMLProps<HTMLAnchorElement>) => void;

export const downloadFromLink: TDownloadFromLink = (attributes) => {
  const a = document.createElement('a');

  if (!attributes.target) {
    a.setAttribute('target', '_blank');
  }

  for (const attribute in attributes) {
    a.setAttribute(attribute, attributes[attribute as keyof HTMLProps<HTMLAnchorElement>]);
  }

  a.click();
};
