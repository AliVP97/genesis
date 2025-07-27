import { IResponseBusyRoute } from 'containers/landingPage/types';
import { SchemaElement } from '.';
import { localContentsGenerator } from '..';

const schmeaConstants = {
  '@context': 'http://schema.org',
  '@type': 'FAQPage',
};

type faqSchemMainEntityModel = {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
};
type faqSchemaModel = {
  '@context': string;
  '@type': string;
  mainEntity: faqSchemMainEntityModel[];
};

export const faqScheamGenerator = ({
  content,
  path,
}: {
  content: IResponseBusyRoute;
  path: string;
}): JSX.Element => {
  try {
    const schema: faqSchemaModel = {
      ...schmeaConstants,
      mainEntity: [],
    };
    const serviceName = path.split('/')[2];
    const extractingDestination = path.match(/\/([^/?]+)(?:\?|$)/);
    const destination = extractingDestination ? extractingDestination[1] : '';
    const cities = destination.length !== 0 ? destination.split('-') : [];

    const faqContent = content?.attributes?.faq?.length
      ? content.attributes.faq.map((obj) => obj)
      : localContentsGenerator({
          serviceName,
          origin: cities[0],
          destination: cities[1],
        })
          .faq()
          .map((obj) => obj);

    const faqschema = faqContent?.map((faq) => {
      return {
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer_text,
        },
      };
    });
    schema.mainEntity = faqschema;

    return SchemaElement(schema);
  } catch (error) {
    return SchemaElement('');
  }
};

export default faqScheamGenerator;
