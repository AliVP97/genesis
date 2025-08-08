import { JSX, ReactNode } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {
  ThemeProvider,
  CssBaseline,
  StyledEngineProvider,
} from '@mui/material';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';

import theme from './theme';

import '../global.css';

// Create rtl cache
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true,
});

const UIProvider = ({ children }: { children: ReactNode }): JSX.Element => (
  <StyledEngineProvider injectFirst>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  </StyledEngineProvider>
);

export default UIProvider;
