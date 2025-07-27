import { Accordion } from 'react-accessible-accordion';
import { useState } from 'react';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';
import FAQItem from 'containers/landingPage/components/faq/components/faqItem';
import { Faq } from 'containers/landingPage/types';

type FAQProps = {
  faq: Array<Faq>;
};

const VisaFAQ = ({ faq }: FAQProps) => {
  const [selectedFaq, setSelectedFaq] = useState<UUID[]>();

  return (
    <div className="mt-4 mb-5">
      <h2 className="fw-bold fs-4 mb-3">سوالات متداول</h2>
      <Accordion onChange={(e) => setSelectedFaq(e)} allowZeroExpanded>
        {faq.map((item, index) => (
          <FAQItem
            key={index.toString() + item.title}
            title={item.title}
            description={item.description}
            id={index}
            selectedItem={selectedFaq}
          />
        ))}
      </Accordion>
    </div>
  );
};
export default VisaFAQ;
