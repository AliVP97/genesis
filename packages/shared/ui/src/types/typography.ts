import { Theme } from '@mui/material/styles';

export type PaletteColor = 'onSurface';

export type TypographySize =
  | 'large'
  | 'large-medium'
  | 'medium-bold'
  | 'medium'
  | 'small-bold'
  | 'small'
  | 'too-small'
  | 'too-small-bold';

export type TypographyColor = keyof Theme['palette'];
