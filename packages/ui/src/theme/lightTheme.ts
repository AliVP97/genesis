import { createTheme } from '@mui/material/styles';
import baseTheme from './baseTheme';
import COLORS from './colors';

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.PRIMARY[40],
    },
    secondary: {
      main: COLORS.SECONDARY[40],
    },
    primaryContainer: {
      main: COLORS.PRIMARY[90],
    },
    onBackground: {
      main: COLORS.PRIMARY[100],
    },
    onPrimaryContainer: {
      main: COLORS.PRIMARY[10],
    },
    onBackgroundContainer: {
      main: COLORS.NEUTRAL[10],
    },
    onSurface: {
      main: COLORS.NEUTRAL[10],
    },
    onPrimary: {
      main: COLORS.PRIMARY[40],
    },
  },
});

export default lightTheme;

// <Icon name="home" />

// <HomeIcon />

// size by ratio (1:1) (24 x 24)
// default on surface
// Duotone icon
