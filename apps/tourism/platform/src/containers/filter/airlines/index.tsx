import React, { useState } from 'react';
import styles from 'containers/filter/filterTicket/filterTicket.module.scss';
import { ArrowDownIcon } from 'assets/icons';
import Checkbox from 'components/checkbox';
import { Airline } from 'pages/flights/[id]';
import Image from 'next/image';
import API from 'utils/routes/api';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { customLoader } from 'utils/helpers/imageLoader';
import defaultImage from 'public/images/default-domestic-flight.png';

interface Props {
  selected: string[] | undefined;
  handleClick: (v: string, t: 'airlines') => void;
  airlines: Airline[];
}

const AirlineList = ({ selected, handleClick, airlines: allAirlines }: Props) => {
  const airlines = allAirlines?.sort((a, b) => {
    if (!!a.price && b.price) {
      return a.price - b.price;
    }
    return 0;
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  return (
    <Accordion>
      <AccordionItem dangerouslySetExpanded={isExpanded}>
        <AccordionItemHeading onClick={() => setIsExpanded(!isExpanded)}>
          <AccordionItemButton className="d-flex">
            <div className={styles['filter__subTitle-airline']}>
              شرکت های هواپیمایی <span className="me-2">({airlines?.length} مورد)</span>
            </div>
            <ArrowDownIcon className="me-auto" />
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel className="p-0">
          <>
            <div>
              {airlines?.map((airline) => {
                const checked = selected && selected.includes(airline.code!);
                return (
                  <div
                    key={airline.code}
                    onClick={() => handleClick(airline.code!, 'airlines')}
                    className={styles.filter__airlineItem}
                  >
                    <Checkbox checked={!!checked} />
                    <div
                      className={
                        checked
                          ? styles['filter__airlineItem-wrapper--active']
                          : styles['filter__airlineItem-wrapper']
                      }
                    >
                      <Image
                        loader={customLoader}
                        src={
                          airline?.code
                            ? API.IMAGE_DOMAIN + `airplane/${airline?.code}.svg`
                            : defaultImage
                        }
                        alt="airline logo"
                        width="32px"
                        height="32px"
                        quality={100}
                        unoptimized
                        objectFit="contain"
                        onError={(e) => {
                          e.currentTarget.src = defaultImage.src;
                        }}
                      />
                      <span>{airline.name}</span>
                      <span className="me-auto">
                        {airline.price! === 0
                          ? 'تکمیل ظرفیت'
                          : ` از ${airline.price!.toLocaleString()} ریال`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};
export default AirlineList;
