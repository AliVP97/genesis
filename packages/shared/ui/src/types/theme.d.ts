import { SimplePaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    onBackground?: SimplePaletteColorOptions;
    primaryContainer: SimplePaletteColorOptions;
    onPrimaryContainer: SimplePaletteColorOptions;
    onBackgroundContainer: SimplePaletteColorOptions;
    onSurface?: SimplePaletteColorOptions;
    onPrimary?: SimplePaletteColorOptions;
  }

  interface PaletteOptions {
    onBackground?: SimplePaletteColorOptions;
    primaryContainer?: SimplePaletteColorOptions;
    onPrimaryContainer?: SimplePaletteColorOptions;
    onBackgroundContainer?: SimplePaletteColorOptions;
    onSurface?: SimplePaletteColorOptions;
    onPrimary?: SimplePaletteColorOptions;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'title-large': React.CSSProperties;
    'title-large-medium': React.CSSProperties;
    'title-medium-bold': React.CSSProperties;
    'title-medium': React.CSSProperties;
    'title-small-bold': React.CSSProperties;
    'title-small': React.CSSProperties;
    'title-too-small': React.CSSProperties;
    'title-too-small-bold': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'title-large'?: React.CSSProperties;
    'title-large-medium'?: React.CSSProperties;
    'title-medium-bold'?: React.CSSProperties;
    'title-medium'?: React.CSSProperties;
    'title-small-bold'?: React.CSSProperties;
    'title-small'?: React.CSSProperties;
    'title-too-small'?: React.CSSProperties;
    'title-too-small-bold'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'title-large': true;
    'title-large-medium': true;
    'title-medium-bold': true;
    'title-medium': true;
    'title-small-bold': true;
    'title-small': true;
    'title-too-small': true;
    'title-too-small-bold': true;
  }
}
