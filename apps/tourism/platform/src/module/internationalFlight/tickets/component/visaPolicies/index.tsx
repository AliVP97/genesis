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

export const VisaPolicies = ({ ticket }: { ticket: TIntelTicket }) => {
  const [isOpenPolicy, setOpenPolicy] = useState<string>();

  const handleOpenPolicy = (title: string) => {
    isOpenPolicy === title ? setOpenPolicy('') : setOpenPolicy(title);
  };

  return (
    <Accordion allowZeroExpanded>
      {ticket?.visaPolicies?.map((visaPolicy) => {
        return (
          <>
            <AccordionItem
              className={cn(styles['policy'], 'rtl m-3')}
              key={visaPolicy.title}
              dangerouslySetExpanded={isOpenPolicy === visaPolicy.title}
              onClick={() => handleOpenPolicy(visaPolicy.title!)}
            >
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div
                    className={cn(
                      styles['policy__accordion__heading'],
                      'mb-0 d-flex justify-content-between w-100',
                      isOpenPolicy !== visaPolicy.title ? 'rounded' : 'rounded-top',
                    )}
                  >
                    <span>{visaPolicy.title}</span>
                    <ArrowDownIcon />
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div
                  className={cn(
                    styles['policy__accordion__body'],
                    'card-body bg-white rounded-bottom',
                  )}
                >
                  {/* <span>{visaPolicy.landingDetails}</span> */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visaPolicy.description || '',
                    }}
                  />
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          </>
        );
      })}
    </Accordion>
  );
};
