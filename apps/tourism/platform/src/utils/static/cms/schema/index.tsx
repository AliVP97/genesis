import Head from 'next/head';
import BreadCrumbSchema from './breadcrumb';
import HotelSchema from './hotel';
import dynamic from 'next/dynamic';

export const [SearchActionSchemaGenerator, FaqSchemaGenerator] = [
  dynamic(() => import('./searchAction'), { ssr: true }),
  dynamic(() => import('./faq'), { ssr: true }),
];

export const SchemaElement = (schemaObject: unknown): JSX.Element => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaObject),
        }}
      />
    </Head>
  );
};

export const schema = {
  breadCrumb: BreadCrumbSchema,
  hotel: HotelSchema,
};
