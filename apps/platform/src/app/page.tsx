'use client';

import { Search } from '@780/bus';
import { UIProvider } from '@780/ui';

export default function Index() {
  return (
    <UIProvider>
      <Search />
    </UIProvider>
  );
}
