import { breadCrumbObjectModel } from 'components/breadcrumb/types';
import { SchemaElement } from '.';

const schemaConstantt = {
  '@context': 'http://schema.org',
  '@type': 'BreadcrumbList',
};

export type breadCrumbSchemaItemListElementModel = {
  '@type': string;
  position: number;
  item: {
    '@id': string;
    name: string;
  };
};

export type breadCrumbSchemaModel = {
  '@context': string;
  '@type': string;
  itemListElement: breadCrumbSchemaItemListElementModel[];
};

export const breadCrumbSchemaGenerator = (breadcrumbObject: breadCrumbObjectModel) => {
  try {
    let i = 1;

    const schema: breadCrumbSchemaModel = {
      ...schemaConstantt,
      itemListElement: [],
    };
    if (Object.keys(breadcrumbObject).length !== 0) {
      for (const breadcrumb in breadcrumbObject) {
        if (breadcrumbObject[breadcrumb]?.fa?.trim()) {
          const breadCrumbSchemaItem = {
            '@type': 'ListItem',
            position: i++,
            item: {
              '@id': `${breadcrumb}`,
              name: `${breadcrumbObject[breadcrumb]?.fa}`,
            },
          };
          schema.itemListElement.push(breadCrumbSchemaItem);
        }
      }
      return SchemaElement(schema);
    }
  } catch (error) {
    SchemaElement('');
  }
};

export default breadCrumbSchemaGenerator;
