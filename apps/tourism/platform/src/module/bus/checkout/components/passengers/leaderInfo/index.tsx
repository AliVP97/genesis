import { FunctionComponent, useMemo } from 'react';
import { BusSeatPersianConvertor } from 'module/bus/checkout/utils';
import { definitions } from 'types/bus';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';

type TLeaderInfoProps = Required<
  Pick<definitions['busPassengers'], 'leaderUserId' | 'passengersInfo'>
> & { isInternational?: boolean };

const LeaderInfo: FunctionComponent<TLeaderInfoProps> = ({
  isInternational,
  leaderUserId,
  passengersInfo,
}) => {
  const leaderInfo = useMemo(
    () => passengersInfo.find(({ userId }) => userId === leaderUserId),
    [passengersInfo, leaderUserId],
  );

  const justPassengersInfo = useMemo(
    () => passengersInfo.filter(({ userId }) => userId !== leaderUserId),
    [passengersInfo, leaderUserId],
  );

  return (
    <>
      <div className="d-md-none">
        <Accordion allowMultipleExpanded allowZeroExpanded>
          {leaderUserId && (
            <AccordionItem className="border-bottom">
              <AccordionItemHeading>
                <AccordionItemButton className="d-flex align-items-center justify-content-between p-3">
                  <span>
                    <b>{leaderInfo?.name}</b>
                    <span className="color-grey-24"> (سرپرست مسافران)</span>
                  </span>
                  <AccordionItemState>
                    {({ expanded }) => (expanded ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                  </AccordionItemState>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="pb-3">
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span>کد ملی</span>
                  <span>{leaderInfo?.nationalCode}</span>
                </div>
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span>شماره موبایل</span>
                  <span>{leaderInfo?.phoneNumber}</span>
                </div>
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span>جنسیت</span>
                  <span>
                    {!!leaderInfo?.gender ? BusSeatPersianConvertor[leaderInfo?.gender] : '-'}
                  </span>
                </div>
                {isInternational && (
                  <>
                    <div className="d-flex justify-content-between px-3 pt-3">
                      <span>شماره پاسپورت</span>
                      <span>{leaderInfo?.passportId}</span>
                    </div>
                    <div className="d-flex justify-content-between px-3 pt-3">
                      <span>تاریخ انقضای پاسپورت</span>
                      <span>{leaderInfo?.passportExpireDate}</span>
                    </div>
                  </>
                )}
                <div className="d-flex justify-content-between px-3 pt-3">
                  <span>تاریخ تولد</span>
                  <span>{leaderInfo?.birthDate}</span>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
          )}
          {justPassengersInfo?.map(
            ({
              userId,
              name,
              gender,
              nationalCode,
              phoneNumber,
              birthDate,
              passportId,
              passportExpireDate,
            }) => (
              <AccordionItem key={userId?.toString() + 'leaderInfoBus'} className="border-bottom">
                <AccordionItemHeading>
                  <AccordionItemButton className="d-flex align-items-center justify-content-between p-3">
                    <span>
                      <b>{name}</b>
                    </span>
                    <AccordionItemState>
                      {({ expanded }) => (expanded ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                    </AccordionItemState>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="pb-3">
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span>کد ملی</span>
                    <span>{nationalCode}</span>
                  </div>
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span>شماره موبایل</span>
                    <span>{phoneNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span>جنسیت</span>
                    <span>{!!gender ? BusSeatPersianConvertor[gender] : '-'}</span>
                  </div>
                  {isInternational && (
                    <>
                      <div className="d-flex justify-content-between px-3 pt-3">
                        <span>شماره پاسپورت</span>
                        <span>{passportId}</span>
                      </div>
                      <div className="d-flex justify-content-between px-3 pt-3">
                        <span>تاریخ انقضای پاسپورت</span>
                        <span>{passportExpireDate}</span>
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-between px-3 pt-3">
                    <span>تاریخ تولد</span>
                    <span>{birthDate}</span>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            ),
          )}
        </Accordion>
      </div>
      <div className="d-none d-md-block">
        <div className="row text-center mx-5 bg-color-blue-grey py-2 rounded-top">
          <div className="col">
            <small className="color-grey-1">نام و نام خانوادگی</small>
          </div>
          <div className="col">
            <small className="color-grey-1">جنسیت</small>{' '}
          </div>
          <div className="col">
            <small className="color-grey-1">کد ملی</small>
          </div>
          <div className="col">
            <small className="color-grey-1">شماره موبایل</small>
          </div>
          {isInternational && (
            <>
              <div className="col">
                <small className="color-grey-1">شماره پاسپورت</small>
              </div>
              <div className="col">
                <small className="color-grey-1">تاریخ انقضای پاسپورت</small>
              </div>
            </>
          )}
          <div className="col">
            <small className="color-grey-1">تاریخ تولد</small>
          </div>
        </div>
        {leaderUserId && (
          <div className="row text-center mx-5 bg-color-white-1 py-2 rounded-bottom">
            <div className="col">
              {' '}
              {leaderInfo?.name}
              <br />
              (سرپرست مسافران){' '}
            </div>
            <div className="col">
              {' '}
              {!!leaderInfo?.gender ? BusSeatPersianConvertor[leaderInfo?.gender] : '-'}
            </div>
            <div className="col"> {leaderInfo?.nationalCode} </div>
            <div className="col"> {leaderInfo?.phoneNumber} </div>
            {isInternational && (
              <>
                <div className="col">{leaderInfo?.passportId}</div>
                <div className="col">{leaderInfo?.passportExpireDate}</div>
              </>
            )}
            <div className="col"> {leaderInfo?.birthDate} </div>
          </div>
        )}
        {justPassengersInfo?.map(
          ({
            userId,
            name,
            gender,
            nationalCode,
            phoneNumber,
            birthDate,
            passportId,
            passportExpireDate,
          }) => (
            <div
              className="row text-center mx-5 bg-color-white-1 py-2 rounded-bottom"
              key={nationalCode + passportId!}
            >
              <div className="col">
                {' '}
                {name}
                {userId === leaderUserId ? (
                  <>
                    <br />
                    (سرپرست مسافران)
                  </>
                ) : (
                  ''
                )}{' '}
              </div>
              <div className="col"> {!!gender ? BusSeatPersianConvertor[gender] : '-'}</div>
              <div className="col"> {nationalCode} </div>
              <div className="col"> {phoneNumber} </div>
              {isInternational && (
                <>
                  <div className="col">{passportId}</div>
                  <div className="col">{passportExpireDate}</div>
                </>
              )}
              <div className="col"> {birthDate} </div>
            </div>
          ),
        )}
      </div>
    </>
  );
};

export default LeaderInfo;
