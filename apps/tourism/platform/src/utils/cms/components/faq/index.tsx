import cn from 'classnames';
import { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';
import FAQItem from './faqItem';
import parse from 'html-react-parser';
import styles from './style.module.scss';
import { CmsFaqProps } from './types';

const CmsFaq = ({ title, items }: CmsFaqProps) => {
  const [selectedFaq, setSelectedFaq] = useState<UUID[]>();

  return (
    <div className="my-4">
      <div className={cn(styles.faq)}>
        <div className={cn(styles.faq__title, 'mb-3 d-flex justify-content-center')}>
          <h2 className="fs-5">{title}</h2>
        </div>

        <div>
          <Accordion onChange={(e) => setSelectedFaq(e)} allowZeroExpanded>
            {items?.map((faq, index) => {
              return (
                <FAQItem
                  key={index.toString() + 'faq'}
                  title={faq?.title}
                  description={parse(faq?.body)}
                  id={index}
                  selectedItem={selectedFaq}
                />
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CmsFaq;
