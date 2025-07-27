import cn from 'classnames';
import styles from '../../styles/invoice.module.scss';
import React, { Dispatch, Fragment, useEffect, useState, memo } from 'react';
import RadioElement from 'components/radio';
import Divider from 'components/divider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getZeroRefund, postZeroRefund } from 'services/domestic/flight';
import useRouter from 'next/router';
import { Restore, ChevronLeftBlueIcon } from 'assets/icons';
import { Switch } from 'components/switchButton/v2';
import RulesModal from './RulesModal';

const SNAPP_PAYMENT_ID = 6;

type RefundProps = {
  isDisabled?: boolean;
  gatewayId?: number;
  setRefundLoading: Dispatch<boolean>;
};

const Refund = memo(({ isDisabled, gatewayId, setRefundLoading }: RefundProps) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const queryClient = useQueryClient();
  const [selectedRefundTitle, setSelectedRefundTitle] = useState<string>('');
  const { query } = useRouter;
  const { data: zeroRefundData, isLoading: getLoading } = useQuery(
    ['zero-refund', query.id as string],
    getZeroRefund,
  );
  const { mutate: mutateZeroRefund, isLoading: postLoading } = useMutation({
    mutationFn: (selectedFlightIds: string[]) => {
      return postZeroRefund(query.id as string, selectedFlightIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('order');
    },
  });

  const radioChangeHandler = (title: string, flightId: string[]) => {
    if (postLoading || title === selectedRefundTitle || gatewayId === SNAPP_PAYMENT_ID) return;
    setSelectedRefundTitle(title);
    mutateZeroRefund(flightId);
  };

  //set the initial refund type and refund legs on mounting
  useEffect(() => {
    const switchStatus = zeroRefundData?.legs?.find((item) => item.isChecked === true);
    setIsSwitchChecked(switchStatus?.isChecked || false);
    setSelectedRefundTitle(switchStatus?.title || '');
  }, [zeroRefundData?.legs]);

  //Return refund loading state to its parent for payment button
  useEffect(() => {
    setRefundLoading(getLoading || postLoading);
  }, [getLoading, postLoading]);

  const onSwitchToggle = () => {
    if (isDisabled || getLoading || postLoading || gatewayId === SNAPP_PAYMENT_ID) return;
    setIsSwitchChecked((prev) => {
      if (prev) {
        mutateZeroRefund([]);
      } else {
        mutateZeroRefund(zeroRefundData?.legs?.[0].flightIds || []);
        setSelectedRefundTitle(zeroRefundData?.legs?.[0].title || '');
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (gatewayId === SNAPP_PAYMENT_ID) {
      setIsSwitchChecked(true);
      mutateZeroRefund(zeroRefundData?.legs?.[0].flightIds || []);
      setSelectedRefundTitle(zeroRefundData?.legs?.[0].title || '');
    }
  }, [gatewayId]);

  return (
    <>
      {zeroRefundData?.legs?.length && !getLoading && (
        <section className={cn(styles.invoice__table, 'mb-3')}>
          <span className={styles.invoice__refund__header}>
            <Restore />
            <span className={'pe-2 text-4'}>استرداد</span>
          </span>
          <div className="px-3 px-md-4 py-4 text-justify">
            <p className={cn('mb-4', styles.invoice__refund__text)}>
              {zeroRefundData?.description?.text}
            </p>
            <div className="d-flex justify-content-start">
              <div className={cn('m-0 py-3 px-2', styles.invoice__refund__box)}>
                <section className="d-flex align-items-center mb-2">
                  <div>
                    <p
                      className={cn(
                        'mb-0 text-4 text-weight-700',
                        styles.invoice__refund__box__text,
                      )}
                    >
                      {zeroRefundData?.title}
                    </p>
                    <p
                      className={cn(
                        'text-justify text-3 mb-0',
                        styles.invoice__refund__box__subtitle,
                      )}
                    >
                      {zeroRefundData?.subtitle}
                    </p>
                  </div>
                  <Switch
                    disabled={isDisabled || gatewayId === SNAPP_PAYMENT_ID}
                    hasIcon={true}
                    small={true}
                    checked={isSwitchChecked}
                    onChange={onSwitchToggle}
                    loading={getLoading || postLoading}
                  />
                </section>

                {zeroRefundData?.legs.length === 1 ? (
                  <div
                    className={cn(
                      'd-flex justify-content-between align-items-start p-3',
                      styles.invoice__refund__box__priceBox,
                    )}
                  >
                    <span>{zeroRefundData?.legs[0].title}</span>
                    <span>{Number(zeroRefundData?.legs[0]?.price).toLocaleString()} ریال </span>
                  </div>
                ) : (
                  isSwitchChecked &&
                  zeroRefundData?.legs.map((item, tIndex) => (
                    <Fragment key={tIndex + 'refund-type'}>
                      <section
                        className={cn(
                          styles.invoice__refund__box__priceBox,
                          'd-flex align-items-center justify-content-between p-3 mb-2 cursor-pointer',
                        )}
                        onClick={() => {
                          radioChangeHandler(item.title || '', item.flightIds || []);
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <RadioElement
                            value={item.title || ''}
                            className="p-0"
                            checked={item.title === selectedRefundTitle}
                            label=""
                            onChange={() => {
                              radioChangeHandler(item.title || '', item.flightIds || []);
                            }}
                            disabled={postLoading || isDisabled || gatewayId === SNAPP_PAYMENT_ID}
                          />
                          <div className="d-flex flex-column align-items-start justify-content-center color-on-surface">
                            <span className="px-2">{item.title}</span>
                            <span className="px-2 text-2 text-3-md color-on-surface-var">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>
                        <span className="color-on-surface">
                          {Number(item?.price).toLocaleString()} ریال{' '}
                        </span>
                      </section>
                    </Fragment>
                  ))
                )}
                {isSwitchChecked && (
                  <span
                    className={cn('text-justify text-3', styles.invoice__refund__box__subtitle)}
                  >
                    {zeroRefundData?.priceDescription}
                  </span>
                )}
              </div>
              <Divider type="vertical" className="mx-4 d-none d-md-block" />
              {zeroRefundData?.policies?.length && (
                <div className="d-none d-md-block">
                  <p className="mb-2 text-3 text-4-md text-weight-500">قوانین و شرایط استفاده</p>
                  <ul className="px-4 mb-0 text-3 text-justify">
                    {zeroRefundData.policies.map((item, pIndex) => (
                      <li className="mb-1" key={pIndex + 'refund-policy'}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="d-inline-block d-md-none text-start w-100">
              <span
                className="color-primary cursor-pointer"
                onClick={() => setIsVisibleModal(true)}
              >
                <span className="text-3 text-weight-500">قوانین و شرایط استفاده</span>
                <span className="me-2 ms-3">
                  <ChevronLeftBlueIcon />
                </span>
              </span>
            </div>
          </div>
        </section>
      )}
      <RulesModal
        visible={isVisibleModal}
        rules={zeroRefundData?.policies || []}
        setIsVisibleModal={setIsVisibleModal}
      />
    </>
  );
});
Refund.displayName = 'Refund';
export default Refund;
