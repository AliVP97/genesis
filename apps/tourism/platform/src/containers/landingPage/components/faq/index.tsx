import cn from 'classnames';
import { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';
import FAQItem from './components/faqItem';
import { useRouter } from 'next/router';
import { ROUTE_NAME, TPath } from '../companyAdvice';
import parse from 'html-react-parser';
import Skeleton from 'components/skeleton';
import styles from './faq.module.scss';
import { Faq } from 'containers/landingPage/types';

type TFAQ = {
  question: string;
  answer_text: string;
  title?: string;
};

export type FAQProps = {
  faqs?: TFAQ[];
  loading?: boolean;
  staticData?: Array<Faq>;
  status?: string;
};

const FAQ = ({ faqs, loading, staticData, status }: FAQProps) => {
  const [selectedFaq, setSelectedFaq] = useState<UUID[]>();
  const router = useRouter();
  const address = router.route.replace('/', '');
  const pathName = address === '' ? 'tourism' : address;
  const faqData = status === 'error' || !faqs ? staticData : faqs;

  return (
    <>
      <div className={cn(styles['faq'])}>
        <div className={cn(styles['faq__title'], 'mb-3 d-flex justify-content-center')}>
          {loading ? (
            <Skeleton type="title" uniqueKey="title" width="100%" height="30" />
          ) : (
            <span className="fs-5">
              {address === 'hotel' || 'tour'
                ? 'سوالات متداول شما از هف‌هشتاد'
                : `سوالات متداول خرید بلیط  ${ROUTE_NAME[pathName as keyof TPath]} از هف‌هشتاد`}
            </span>
          )}
        </div>
        {loading ? (
          <Skeleton type="faq" uniqueKey="faq" width="100%" height="500" />
        ) : (
          <div>
            <Accordion onChange={(e) => setSelectedFaq(e)} allowZeroExpanded>
              {faqData?.map((faq, index) => {
                let title: string | undefined;
                let description: string | undefined;

                if ('answer_text' in faq) {
                  title = faq?.question;
                  description = faq?.answer_text;
                } else {
                  title = faq?.title;
                  description = faq?.description;
                }

                return (
                  <FAQItem
                    key={index.toString() + 'faq'}
                    title={title}
                    description={parse(description || '')}
                    id={index}
                    selectedItem={selectedFaq}
                  />
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    </>
  );
};

export default FAQ;
