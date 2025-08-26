import { ReactNode, useMemo } from 'react';

import { StoreApi, useStore } from 'zustand';

export type App<R, P> = {
  repository: StoreApi<R>;
  presenter: (args: R) => P;
  view: (args: P) => ReactNode;
};

export const DependencyInjector = <R, P>(app: App<R, P>): ReactNode => {
  const { repository, view } = app;

  const repositoryInstance = useStore(repository);

  const presenterInstance = useMemo(
    () => app.presenter(repositoryInstance),
    [app, repositoryInstance],
  );

  return view(presenterInstance);
};
