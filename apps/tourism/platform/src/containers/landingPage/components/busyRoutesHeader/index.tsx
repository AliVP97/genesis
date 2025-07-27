import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IBusyRoute } from 'containers/landingPage/types';

export const BusyRoutesHeader = ({ data }: { data: Array<IBusyRoute> }) => {
  const { query, pathname } = useRouter();
  const routeName = pathname.split('/', 2)[1];

  return (
    <div>
      {data?.map((item) =>
        item?.routes.map(
          (route, idx) =>
            query.id === route?.id && (
              <Head key={idx}>
                <link
                  rel="canonical"
                  href={`${process.env.NEXT_PUBLIC_DOMAIN}tourism/${routeName}/${query?.id}`}
                />
                {route?.content?.title}
              </Head>
            ),
        ),
      )}
    </div>
  );
};
