import React, { Fragment } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import styles from '../../styles/invoice.module.scss';
import { ArrowDownIcon } from 'assets/icons';
import cn from 'classnames';
import dayjs from 'dayjs';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { GetOrder } from 'services/domestic/flight/interface';

interface Props {
  order: GetOrder;
}

const InvoicePassengers = ({ order }: Props) => {
  const { isMobile } = useDeviceDetect();

  const allowedBaggageWeight = (ageType: string | undefined) => {
    if (ageType === 'AGE_TYPE_INFANT') {
      return (
        order?.passengers?.[0]?.tickets?.[0]?.flightInfo?.allowedBaggage?.[0]?.infantWeight ?? '__'
      );
    } else {
      return (
        order?.passengers?.[0]?.tickets?.[0]?.flightInfo?.allowedBaggage?.[0]
          ?.adultAndChildWeight ?? '__'
      );
    }
  };

  return (
    <div className="p-3 mb-3">
      {isMobile ? (
        <Accordion className={styles['invoice__accordion']} allowMultipleExpanded allowZeroExpanded>
          {order.passengers?.map(({ passenger }) => {
            return (
              <Fragment key={passenger?.passengerID}>
                <AccordionItem key={passenger?.nationalCode}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div className="text-3 text-weight-500 d-flex align-items-center">
                        <span className="col d-flex">
                          <div className="ms-1 d-flex flex-column">
                            <div className="mb-1">
                              {`${passenger?.firstname?.farsi} ${passenger?.lastname?.farsi}`}
                            </div>
                            <div>
                              {`${passenger?.firstname?.english} ${passenger?.lastname?.english}`}
                            </div>
                          </div>
                        </span>
                        <span className="d-flex align-items-center">
                          <ArrowDownIcon className={styles['invoice__expandIcon']} />
                        </span>
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">کد ملی </span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {passenger?.nationalCode}
                      </span>
                    </div>

                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">جنسیت </span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {passenger?.gender == 'GENDER_TYPE_MALE' ? 'آقا' : 'خانم'}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">تاریخ تولد</span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {dayjs(passenger?.birthDate).calendar('jalali').format('YYYY/MM/DD')}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">بار مجاز</span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {allowedBaggageWeight(passenger?.ageType)} کیلوگرم
                      </span>
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>

                <div className={cn(styles['invoice__divider'], 'my-3')} />
              </Fragment>
            );
          })}
        </Accordion>
      ) : (
        <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
          <thead>
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
                <span>جنسیت</span>
              </th>
              <th>
                <span>کد ملی</span>
              </th>
              {/*<th>*/}
              {/*  <span>شماره پاسپورت</span>*/}
              {/*</th>*/}
              {/*<th>*/}
              {/*  <span>تاریخ انقضا پاسپورت</span>*/}
              {/*</th>*/}
              <th>
                <span>تاریخ تولد</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.passengers?.map(({ passenger }, index) => {
              return (
                <tr
                  className={cn(styles['invoice__inside-table__content'], 'w-100 text-center')}
                  key={index.toString() + passenger?.nationalCode}
                >
                  <td className="pt-2">
                    <div
                      className={cn(styles['invoice__font'], 'text-weight-500')}
                    >{`${passenger?.firstname?.english} ${passenger?.lastname?.english}`}</div>
                    <div className="text-3 color-grey-1">{`${passenger?.firstname?.farsi} ${passenger?.lastname?.farsi}`}</div>
                  </td>
                  <td>
                    <span>{passenger?.gender == 'GENDER_TYPE_MALE' ? 'آقا' : 'خانم'}</span>
                  </td>
                  <td>
                    <span>{passenger?.nationalCode}</span>
                  </td>
                  <td>
                    <span>
                      {' '}
                      {dayjs(passenger?.birthDate).calendar('jalali').format('YYYY/MM/DD')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoicePassengers;
