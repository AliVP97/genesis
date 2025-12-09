'use client';

import { ReactNode, useState, useEffect } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import {
  ThemeProvider,
  CssBaseline,
  StyledEngineProvider,
} from '@mui/material';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { useServerInsertedHTML } from 'next/navigation';
import { prefixer } from 'stylis';

import theme from './theme';

import '../global.css';

// Client-side cache, shared for the whole session of the user in the browser.
const createEmotionCache = () => {
  return createCache({
    key: 'css',
    prepend: true,
    stylisPlugins: [prefixer, rtlPlugin],
  });
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const UIProvider = ({ children }: { children: ReactNode }) => {
  const [cache] = useState(clientSideEmotionCache);
  const [mounted, setMounted] = useState(false);

  useServerInsertedHTML(() => {
    const { key, inserted } = cache;
    return (
      <style
        key={key}
        data-emotion={`${key} ${Object.keys(inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(inserted).join(' '),
        }}
      />
    );
  });

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup function
      cache.sheet.tags = [];
    };
  }, [cache]);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <CacheProvider value={cache}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
};

export default UIProvider;
