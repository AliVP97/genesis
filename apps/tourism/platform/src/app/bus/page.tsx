'use client';

import { Search } from '@780/bus';
import { Shared } from '@780/shared';

export default function Page() {
  return (
    <div>
      <h1>Welcome to BUS!</h1>
      <Search />
      <Shared />
    </div>
  );
}
