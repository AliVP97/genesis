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
