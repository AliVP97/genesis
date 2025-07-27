import React, { createElement, FC, useMemo } from 'react';
import Head from 'next/head';
import { TProps } from './type';
import { useLogicHeader } from './hooks/useLogicHeader';

export const NewSeoMeta: FC<TProps> = ({ metaData, children }) => {
  const { filteredMetaTags } = useLogicHeader({ metaData });

  const metaTags = useMemo(
    () =>
      filteredMetaTags.map((item) => {
        switch (item.tag) {
          case 'title':
            return createElement(item.tag, item.attributes);
          case 'link':
            return createElement(item.tag, item.attributes);
          case 'meta':
            return createElement(item.tag, item.attributes);
          default:
            return false;
        }
      }),
    [filteredMetaTags],
  );

  return (
    <Head>
      {metaTags}
      {children}
    </Head>
  );
};
