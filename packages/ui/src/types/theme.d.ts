import { SimplePaletteColorOptions } from '@mui/material/styles';
import { typographyVariants } from '../resources/theme';

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
    title: typeof typographyVariants;
  }

  interface TypographyVariantsOptions {
    title?: typeof typographyVariants;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true;
  }
}
