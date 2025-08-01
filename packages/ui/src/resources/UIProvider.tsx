import { JSX, ReactNode } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';

import createCache from '@emotion/cache';
import theme from './theme';

import '../global.css';

// Create rtl cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const UIProvider = ({ children }: { children: ReactNode }): JSX.Element => (
  <CacheProvider value={rtlCache}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </CacheProvider>
);

export default UIProvider;
