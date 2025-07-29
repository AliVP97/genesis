import { Typography, TypographyProps } from '@mui/material';
import { FC } from 'react';
import { TypographyColor, TypographySize } from '../../types/typography';

const sizeMap: Record<
  TypographySize,
  Pick<Partial<TypographyProps>, 'fontSize' | 'fontWeight' | 'lineHeight'>
> = {
  large: { fontSize: '22px', fontWeight: 400, lineHeight: '28px' },
  'large-medium': {
    fontSize: '22px',
    fontWeight: 500,
    lineHeight: '28px',
  },
  'medium-bold': {
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '24px',
  },
  medium: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
  },
  'small-bold': {
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '20px',
  },
  small: { fontSize: '14px', fontWeight: 500, lineHeight: '20px' },
  'too-small': {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '20px',
  },
  'too-small-bold': {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '20px',
  },
};

const Title: FC<
  Omit<TypographyProps, 'variant' | 'color'> & {
    size?: TypographySize;
    color?: TypographyColor;
  }
> = ({ size = 'medium', color = 'onSurface', ...props }) => {
  if (!sizeMap[size]) {
    throw new Error(`Invalid size: ${size}`);
  }

  const data = sizeMap[size];

  return <Typography {...data} color={color} data-figma-name={`title/${size}`} {...props} />;
};

export default Title;
