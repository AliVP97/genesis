import { ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import theme from './theme';
import '../global.css';

const UIProvider = ({ children }: { children: ReactNode }): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default UIProvider;
