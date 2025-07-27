import { FC } from 'react';
import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import { DiscountInput } from 'components/discountInput';
import { TBusOrder } from 'services/bus/order/interface';

import { ArrowDownIcon, FactorIcon } from 'assets/icons';
import styles from '../../styles/invoice.module.scss';
import { UseDiscountReturnType } from 'components/discount/types/discountTypes';

type TFactorProps = { order?: TBusOrder } & UseDiscountReturnType;

const Factor: FC<TFactorProps> = ({
  order,
  submitHandler,
  changeHandler,
  clearHandler,
  isLoading,
  status,
  message,
  isDisabledBtn,
}) => {
  return (
    <>
      <div className="d-md-none">
        <div className={cn(styles['invoice__table'], 'mx-auto rtl')}>
          <div
            className={cn(
              styles['invoice__table__header'],
              'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
            )}
          >
            <FactorIcon />
            <span className="pe-2"> فاکتور </span>
          </div>

          <div className="trl">
            <div className="w-100 d-flex flex-column py-4 px-2">
              <div>
                <span className="text-3">
                  اگر کد تخفیف دارید،‌ آن را وارد کنید و دکمه اعمال کد را بزنید.
                </span>
              </div>
              <form className="mt-3" onSubmit={submitHandler}>
                <DiscountInput
                  name="discountCode"
                  defaultValue={order?.discount?.code}
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
                        <h5 className="color-green-1 ps-1 text-5 text-weight-500">
                          {Number(order?.totalPrice).toLocaleString()}
                          <small className="pe-1">ریال</small>
                        </h5>
                        <ArrowDownIcon />
                      </span>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="text-3">
                  <div className="d-flex justify-content-between mt-2 py-3 p-4">
                    <span className="text-weight-500">قیمت هر صندلی</span>
                    <div>
                      <b className="color-primary text-4 text-weight-500">
                        {Number(order?.busInfo?.price).toLocaleString()}
                        <small className="pe-1">ریال</small>
                      </b>
                    </div>
                  </div>
                  <hr className="m-0 mx-3" />
                  <div className="d-flex justify-content-between mt-2 py-3 p-4">
                    <span>تعداد مسافران</span>
                    <div className="text-4 text-weight-500">
                      {order?.passengers?.nationalCode?.length}
                    </div>
                  </div>
                  <hr className="m-0 mx-3" />
                  <div className="d-flex justify-content-between mt-2 py-3 p-4">
                    <span> تخفیف </span>
                    <div>
                      <span className="text-4 text-weight-500">
                        {order?.discount?.amount
                          ? Number(order?.discount?.amount).toLocaleString()
                          : 0}
                      </span>
                      <small> ریال</small>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className={cn(styles['invoice__table'], 'mx-auto rtl d-none d-md-block')}>
        <div
          className={cn(
            styles['invoice__table__header'],
            'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
          )}
        >
          <FactorIcon />
          <span className="pe-2"> فاکتور </span>
        </div>
        <div className="mt-3 pb-4">
          <div className="row text-center mx-5 bg-color-blue-grey py-2 rounded-top">
            <div className="col">
              <small className="color-grey-1"> قیمت هر صندلی </small>
            </div>
            <div className="col">
              <small className="color-grey-1"> تعداد مسافران</small>
            </div>
            <div className="col">
              <small className="color-grey-1">تخفیف</small>
            </div>
            <div className="col">
              <b className="color-green-1"> قابل پرداخت </b>
            </div>
          </div>
          <div className="row text-center mx-5 bg-color-white-1 py-2 rounded-bottom">
            <div className="col">
              <b className="color-primary">
                {Number(order?.busInfo?.price).toLocaleString()}
                <small className="pe-1">ریال</small>
              </b>
            </div>
            <div className="col">
              <b className="color-primary">{order?.passengers?.nationalCode?.length}</b>
            </div>
            <div className="col">
              <b className="color-primary">
                {order?.discount?.amount ? Number(order?.discount?.amount).toLocaleString() : 0}
                <small className="pe-1">ریال</small>
              </b>
            </div>
            <div className="col">
              <b className="color-green-1">
                {Number(order?.totalPrice).toLocaleString()}
                <small className="pe-1">ریال</small>
              </b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Factor;
