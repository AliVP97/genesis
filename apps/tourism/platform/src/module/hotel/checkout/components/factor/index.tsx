import React, { FC } from 'react';
import styles from '../../styles/invoice.module.scss';
import { ArrowDownIcon, FactorIcon } from 'assets/icons';
import cn from 'classnames';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { DiscountInput } from 'components/discountInput';
import { TFactorProps } from '../../interface';

const Factor: FC<TFactorProps> = ({
  paymentOrder,
  submitHandler,
  changeHandler,
  clearHandler,
  isLoading,
  status,
  message,
  isDisabledBtn,
}) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div
      className={cn(
        isMobile ? styles['invoice__share'] : styles['invoice__table'],
        'mx-auto',
        !isMobile && 'mb-3',
      )}
    >
      <div
        className={cn(
          isMobile ? styles['invoice__share--header'] : styles['invoice__table__header'],
          'd-flex align-items-center  color-grey-1 text-weight-500 pe-3',
        )}
      >
        <FactorIcon />
        <span className="pe-2 color-black">فاکتور</span>
      </div>

      <div className={cn(isMobile ? 'mb-3' : 'px-5 py-3')}>
        {isMobile && (
          <>
            <div className="w-100 d-flex flex-column py-4 px-2">
              <div>
                <span className="text-3">
                  اگر کد تخفیف دارید،‌ آن را وارد کنید و دکمه اعمال کد را بزنید.
                </span>
              </div>
              <form className="mt-3" onSubmit={submitHandler}>
                <DiscountInput
                  name="discountCode"
                  defaultValue={paymentOrder?.discount?.code}
                  isLoading={isLoading}
                  status={status}
                  onChange={changeHandler}
                  onClear={clearHandler}
                  message={message}
                  isSubmitDisabled={isDisabledBtn}
                />
              </form>
            </div>
            <Accordion allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <div className="text-4 text-weight-400 d-flex align-items-center bg-color-green-2 p-3 px-4">
                      <span className="col d-flex">
                        <div className="ms-1 d-flex flex-column">
                          <div className="">
                            <span className="color-green-1">مبلغ قابل پرداخت</span>
                          </div>
                        </div>
                      </span>
                      <span className="d-flex align-items-center">
                        <h5 className="color-green-1 text-5 text-weight-500 pt-1">
                          {Number(paymentOrder?.totalPrice).toLocaleString()}
                          <small className="pe-1">ریال</small>
                        </h5>
                        <ArrowDownIcon />
                      </span>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="text-3">
                  <>
                    <div className="d-flex justify-content-between mt-2 py-3 p-4">
                      <span> تخفیف </span>
                      <div>
                        <span className="text-4 text-weight-500">
                          {paymentOrder?.discount?.amount
                            ? Number(paymentOrder?.discount?.amount).toLocaleString()
                            : 0}
                        </span>
                        <small> ریال</small>
                      </div>
                    </div>
                    <hr className="m-0 mx-3" />
                    <div className="d-flex justify-content-between mt-2 py-3 p-4">
                      <span> کسر اعتبار </span>
                      <div>
                        <span className="text-4 text-weight-500">0</span>
                        <small> ریال</small>
                      </div>
                    </div>
                  </>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
        {!isMobile && (
          <div>
            <div className="mt-3 pb-4">
              <div className="row text-center mx-5 bg-color-blue-grey py-2 rounded-top">
                <div className="col-3">
                  <small className="color-grey-1"> مبلغ هتل </small>
                </div>
                <div className="col-3">
                  <small className="color-grey-1"> تخفیف</small>
                </div>
                <div className="col-3">
                  <small className="color-grey-1">کسر اعتبار</small>
                </div>
                <div className="col-3">
                  <b className="color-green-1"> قابل پرداخت </b>
                </div>
              </div>
              <div className="row text-center mx-5 bg-color-white-1 py-2 rounded-bottom">
                <div className="col-3">
                  <b className="color-primary">
                    {' '}
                    {paymentOrder?.basePrice?.toLocaleString()}
                    <small className="pe-1">ریال</small>
                  </b>
                </div>
                <div className="col-3 color-primary">
                  <b className=""> {paymentOrder?.discount?.amount?.toLocaleString()}</b>
                  <small className="pe-1">ریال</small>
                </div>
                <div className="col-3 color-primary">
                  <b className="">0</b>
                  <small className="pe-1">ریال</small>
                </div>
                <div className="col-3">
                  <b className="color-green-1">
                    {paymentOrder?.totalPrice?.toLocaleString()}
                    <small className="pe-1">ریال</small>
                  </b>
                </div>
              </div>
            </div>
          </div>
        )}{' '}
      </div>
    </div>
  );
};

export default Factor;
