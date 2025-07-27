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
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { PersianPassengerType } from 'module/internationalFlight/tickets/interface';
import PassengerV2 from '../../types/PassengerV2';

interface Props {
  passengers: PassengerV2[];
}

const InvoicePassengers = ({ passengers }: Props) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="p-3 mb-3">
      {isMobile ? (
        <Accordion className={styles['invoice__accordion']} allowMultipleExpanded allowZeroExpanded>
          {passengers.map((passenger) => {
            return (
              <Fragment key={passenger?.passengerId}>
                <AccordionItem key={passenger?.passengerId}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div className="text-3 text-weight-500 d-flex align-items-center">
                        <span className="col d-flex ltr">
                          <div className="ms-1 d-flex flex-column">
                            {`${passenger?.firstName?.english} ${passenger?.lastName?.english}`}
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
                      <span className="col">جنسیت </span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {passenger?.gender == 'GENDER_MALE' ? 'آقا' : 'خانم'}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col"> شماره پاسپورت</span>
                      <span className="col justify-content-end ps-2 d-flex en">
                        {passenger.passport?.number}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">انقضای پاسپورت</span>
                      <span
                        className="col justify-content-start ps-2 d-flex ltr"
                        style={{ fontFamily: 'Roboto' }}
                      >
                        {passenger.passport?.expireDate}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">کشور صادرکننده پاسپورت</span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {passenger.passport?.issueCountryCode}
                      </span>
                    </div>
                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">نوع مسافر</span>
                      <span className="col justify-content-end ps-2 d-flex">
                        {PersianPassengerType['PASSENGER_TYPE_' + passenger.passengerType!]}
                      </span>
                    </div>

                    <div className="color-grey-1 text-3 d-flex py-2">
                      <span className="col">تاریخ تولد </span>
                      <span
                        className="col justify-content-start ps-2 d-flex ltr"
                        style={{ fontFamily: 'Roboto' }}
                      >
                        {passenger?.birthDate}
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
                <span>نام و نام خانوادگی به لاتین</span>
              </th>
              <th>
                <span>جنسیت</span>
              </th>
              <th>
                <span>نوع مسافر</span>
              </th>
              <th>
                <span>شماره پاسپورت</span>
              </th>
              <th>
                <span>تاریخ انقضا پاسپورت</span>
              </th>
              <th>
                <span>کشور صادر‌کننده پاسپورت</span>
              </th>
              <th>
                <span>تاریخ تولد</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {passengers?.map((passenger, index) => {
              return (
                <tr
                  className={cn(styles['invoice__inside-table__content'], 'w-100 text-center')}
                  key={index.toString() + passenger.firstName?.english}
                >
                  <td className="pt-2">
                    <div
                      className={cn(styles['invoice__font'], 'text-weight-500')}
                    >{`${passenger.firstName?.english} ${passenger?.lastName?.english}`}</div>
                  </td>
                  <td>
                    <span>{passenger?.gender == 'GENDER_MALE' ? 'آقا' : 'خانم'}</span>
                  </td>
                  <td>
                    <span>
                      {PersianPassengerType['PASSENGER_TYPE_' + passenger.passengerType!]}
                    </span>
                  </td>
                  <td>
                    <span className="en">{passenger?.passport?.number}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'Roboto' }}>{passenger?.passport?.expireDate}</span>
                  </td>
                  <td>
                    <span>{passenger?.passport?.issueCountryCode}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'Roboto' }}> {passenger?.birthDate}</span>
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
