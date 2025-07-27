import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import cn from 'classnames';
import styles from '../../tickets.module.scss';
import { ArrowDownIcon } from 'assets/icons';
import React, { useState } from 'react';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import Spinner from 'components/spinner';

export const IntelRefundPolicies = ({
  ticket,
  isLoading,
}: {
  ticket: TIntelTicket;
  isLoading: boolean;
}) => {
  const [isOpenPolicy, setOpenPolicy] = useState<string>();
  const detectLanguage = (text: string) => {
    if (/^[a-zA-Z]+$/.test(text.charAt(0))) return 'en';
    else return 'fa';
  };
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : ticket?.refundPolicies && ticket?.refundPolicies?.length > 0 ? (
        <Accordion allowZeroExpanded>
          {ticket?.refundPolicies?.map((refundPolicy) => {
            return (
              <>
                <AccordionItem
                  className={cn(styles['policy'], 'rtl m-3')}
                  key={refundPolicy.title}
                  dangerouslySetExpanded={isOpenPolicy === refundPolicy.title}
                  onClick={() =>
                    isOpenPolicy && isOpenPolicy === refundPolicy.title
                      ? setOpenPolicy('')
                      : setOpenPolicy(refundPolicy.title)
                  }
                >
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div
                        className={cn(
                          styles['policy__accordion__heading'],
                          'mb-0 d-flex justify-content-between w-100',
                          isOpenPolicy && isOpenPolicy !== refundPolicy.title
                            ? 'rounded'
                            : 'rounded-top',
                        )}
                      >
                        <span>{refundPolicy.title}</span>
                        <ArrowDownIcon />
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div
                      className={cn(
                        styles['policy__accordion__body'],
                        'card-body bg-white rounded-bottom',
                        detectLanguage(refundPolicy.description!) == 'fa' ? 'rtl' : 'ltr',
                      )}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: refundPolicy.description || '',
                        }}
                      />
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>
              </>
            );
          })}
        </Accordion>
      ) : (
        <div className="rtl p-3 alert alert-info text-center">
          مسافر گرامی، برای اطلاع از شرایط استرداد، لطفا با پشتیبانی (4780-021) تماس بگیرید
        </div>
      )}
    </>
  );
};
