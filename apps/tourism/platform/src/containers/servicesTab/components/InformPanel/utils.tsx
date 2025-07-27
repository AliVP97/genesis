import { FC, HTMLAttributes } from 'react';

import { Info } from 'assets/icons';

type TMessage = {
  type: 'information' | 'warning' | 'error' | 'success';
  text: string;
};

export const MESSAGES: TMessage[] = [];

export const IconMapper: FC<
  {
    iconType: TMessage['type'];
  } & HTMLAttributes<HTMLOrSVGElement>
> = ({ iconType, ...props }) => {
  switch (iconType) {
    case 'information':
      return <Info {...props} />;
    case 'warning':
      return <div />;
    case 'error':
      return <div />;
    case 'success':
      return <div />;
    default:
      return <Info {...props} />;
  }
};
