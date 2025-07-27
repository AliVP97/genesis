import React from 'react';
import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import { TrainOrder } from 'services/train/orders/interface';
import { useResponsive } from 'utils/hooks/useResponsive';
import useTimeConvertor from 'utils/hooks/useTimeConvertor';
import { tariff2AgeType } from '../../helper';

import { ArrowDownIcon, InfoIcon } from 'assets/icons';
import styles from '../../styles/invoice.module.scss';

interface Props {
  order: TrainOrder;
}

const Passengers = ({ order }: Props) => {
  const { isMobile } = useResponsive();

  const ConvertBirthdate = (timeStamp: string) => {
    return useTimeConvertor(timeStamp);
  };

  const hasInfant = order?.trips?.[0]?.tickets?.some(({ tariff }) => tariff === 'TARIFF_INFANT');

  return (
    <div className="p-3 mb-3">
      {isMobile ? (
        <Accordion className={styles['invoice__accordion']} allowMultipleExpanded allowZeroExpanded>
          {order.trips?.[0].tickets?.map((ticket, ticketIndex) => (
            <>
              <AccordionItem key={ticket.id}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="text-3 text-weight-500 d-flex align-items-center">
                      <span className="col d-flex">
                        {ticket.passenger?.isForeign
                          ? `${ticket.passenger?.englishFirstName} ${ticket.passenger?.englishLastName}`
                          : `${ticket.passenger?.firstName} ${ticket.passenger?.lastName}`}
                        {ticket.tariff && (
                          <span className={styles['invoice__accordion__passengerType']}>
                            {tariff2AgeType[ticket.tariff]}
                          </span>
                        )}
                      </span>
                      <span className="d-flex align-items-center">
                        <ArrowDownIcon className={styles['invoice__expandIcon']} />
                      </span>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  {ticket.passenger?.isForeign ? (
                    <>
                      <div className="color-grey-1 text-3 d-flex py-2">
                        <span className="col">شماره پاسپورت</span>
                        <span className="col justify-content-end ps-2 d-flex">
                          {ticket.passenger?.passportId}
                        </span>
                      </div>
                      <div className="color-grey-1 text-3 d-flex py-2">
                        <span className="col">تاریخ انقضای پاسپورت</span>
                        <span className="col justify-content-end ps-2 d-flex">
                          {ticket.passenger?.passportExpireDate}
                        </span>
                      </div>
                      <div className="color-grey-1 text-3 d-flex py-2">
                        <span className="col">کشور محل تولد</span>
                        <span className="col justify-content-end ps-2 d-flex">
                          {ticket.passenger?.passportCountryDetail?.countryNameFa}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">کد ملی </span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {ticket.passenger?.nationalCode}
                      </span>
                    </div>
                  )}
                  <div className="color-grey-1 text-3 d-flex py-2">
                    <span className="col">جنسیت </span>
                    <span className="col justify-content-end ps-2 d-flex">
                      {ticket.passenger?.genderType == 'GENDER_TYPE_MALE' ? 'مرد' : 'زن'}
                    </span>
                  </div>
                  <div className="color-grey-1 text-3 d-flex py-2">
                    <span className="col">تاریخ تولد </span>
                    <span className="col justify-content-end ps-2 d-flex">
                      {ConvertBirthdate(ticket?.passenger?.birthDate as string).year +
                        '/' +
                        ConvertBirthdate(ticket?.passenger?.birthDate as string).monthIndex +
                        '/' +
                        ConvertBirthdate(ticket?.passenger?.birthDate as string).date}
                    </span>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>

              {ticketIndex < (order?.trips?.[0]?.tickets?.length || 0) - 1 && (
                <div className={cn(styles['invoice__divider'], 'my-3')} />
              )}
            </>
          ))}
          {hasInfant && (
            <div className={styles['invoice__accordion__info-message']}>
              مسافران در رده سنی نوزادان صندلی اختصاصی نخواهند داشت و تنها مبلغی به عنوان بیمه مسافر
              برای آنان لحاظ می‌شود.
            </div>
          )}
        </Accordion>
      ) : (
        <>
          <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
            <tr
              className={cn(
                styles['invoice__inside-table__header'],
                'w-100 m-0 color-grey-1 text-center ',
              )}
            >
              <th>
                <span>نام و نام خانوادگی</span>
              </th>
              <th>
                <span>نوع مسافر</span>
              </th>
              <th>
                <span>جنسیت</span>
              </th>
              <th>
                <span>کد ملی/شماره پاسپورت</span>
              </th>
              <th>
                <span> تاریخ تولد </span>
              </th>
            </tr>
            <tbody className={cn(styles['invoice__table__body'])}>
              {order.trips?.[0].tickets?.map((ticket, ticketIndex) => (
                <>
                  <tr key={ticketIndex}>
                    <td>
                      {ticket.passenger?.isForeign
                        ? `${ticket.passenger?.englishFirstName} ${ticket.passenger?.englishLastName}`
                        : `${ticket.passenger?.firstName} ${ticket.passenger?.lastName}`}
                    </td>
                    <td>{ticket?.tariff ? tariff2AgeType[ticket.tariff] : '-'}</td>
                    <td>{ticket.passenger?.genderType == 'GENDER_TYPE_MALE' ? 'مرد' : 'زن'}</td>
                    <td>
                      {ticket.passenger?.isForeign
                        ? ticket.passenger?.passportId
                        : ticket.passenger?.nationalCode}
                    </td>
                    <td>
                      {ConvertBirthdate(ticket?.passenger?.birthDate as string).year +
                        '/' +
                        ConvertBirthdate(ticket?.passenger?.birthDate as string).monthIndex +
                        '/' +
                        ConvertBirthdate(ticket?.passenger?.birthDate as string).date}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          {hasInfant && (
            <div className={styles['invoice__accordion__info-message']}>
              <InfoIcon className={styles['invoice__accordion__info-message__icon']} />
              <span className={styles['invoice__accordion__info-message__message']}>
                مسافران در رده سنی نوزادان صندلی اختصاصی نخواهند داشت و تنها مبلغی به عنوان بیمه
                مسافر برای آنان لحاظ می‌شود.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Passengers;
