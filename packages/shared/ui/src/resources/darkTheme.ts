import { createTheme } from '@mui/material/styles';

import baseTheme from './baseTheme';
import COLORS from './colors';

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.PRIMARY[70],
      contrastText: COLORS.PRIMARY[20],
    },
    primaryContainer: {
      main: COLORS.PRIMARY[30],
      contrastText: COLORS.PRIMARY[40],
    },
  },
});

export default darkTheme;
