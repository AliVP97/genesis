import { SchemaElement } from '.';

const schmeaConstants = {
  '@context': 'https://schema.org',
  '@type': 'SearchAction',
  url: 'https://780.ir/',
};

type searchActionSchemPotentialActionModel = {
  target: string;
  query: string;
};
type searchActionSchemaModel = {
  '@context': string;
  '@type': string;
  url: string;
  potentialAction?: searchActionSchemPotentialActionModel;
};

export const searchActionSchemaGenerator = ({ path = '' }: { path?: string }): JSX.Element => {
  const schema: searchActionSchemaModel = {
    ...schmeaConstants,
  };
  schema.potentialAction = {
    target: path,
    query: 'required',
  };
  return SchemaElement(schema);
};

export default searchActionSchemaGenerator;
