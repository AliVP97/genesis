import { ArrowDownIcon } from 'assets/icons';
import cn from 'classnames';
import {
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';
import styles from '../../faq.module.scss';
type FAQItemProps = {
  title: string;
  description: string;
  id: number;
  selectedItem: UUID[] | undefined;
};
const HotelItem = ({ title, description, id, selectedItem }: FAQItemProps) => {
  return (
    <>
      <AccordionItem className="mb-3" uuid={id}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <div
              className={cn(
                styles['faq__accordion__heading'],
                'mb-0 d-flex justify-content-between w-100',
                selectedItem && selectedItem[0] !== id ? 'rounded' : 'rounded-top',
              )}
            >
              <span>{title}</span>
              {(selectedItem && selectedItem[0]) !== id ? <ArrowDownIcon /> : ''}
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <div className={cn(styles['faq__accordion__body'], 'card-body bg-white rounded-bottom')}>
            <span>{description}</span>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    </>
  );
};

export default HotelItem;
