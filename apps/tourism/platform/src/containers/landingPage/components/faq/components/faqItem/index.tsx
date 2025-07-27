import React from 'react';
import cn from 'classnames';
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';
import { ArrowDownIcon } from 'assets/icons';
import styles from '../../faq.module.scss';

type FAQItemProps = {
  title?: string;
  description?: React.ReactNode;
  id: number;
  selectedItem: UUID[] | undefined;
};

const FAQItem = ({ title, description, id, selectedItem }: FAQItemProps) => {
  return (
    <>
      <AccordionItem className="mb-3" uuid={id} dir="rtl">
        <AccordionItemHeading>
          <AccordionItemButton>
            <div
              className={cn(
                styles['faq__accordion__heading'],
                'mb-0 d-flex justify-content-between w-100',
                selectedItem && selectedItem[0] !== id ? 'rounded' : 'rounded-top',
              )}
            >
              <span className="color-on-surface">{title}</span>
              {(selectedItem && selectedItem[0]) !== id ? <ArrowDownIcon /> : ''}
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <div
            className={cn(
              styles['faq__accordion__body'],
              'card-body bg-surface-container-lowest rounded-bottom',
            )}
          >
            <span className="color-on-surface-var">{description}</span>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </>
  );
};

export default FAQItem;
