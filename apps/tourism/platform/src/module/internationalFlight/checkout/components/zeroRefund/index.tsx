import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import styles from '../../styles/invoice.module.scss';
import GetOrderResponseV2 from '../../types/GetOrderResponseV2';
import { ZeroRefundIcon } from 'assets/icons';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { UseDiscountReturnType } from 'components/discount/types/discountTypes';

import { applyPackage, removePackage } from 'services/internationalFlight/order';
import { useMutation } from 'react-query';
import { TApplyPackage } from 'services/internationalFlight/order/interface';
import ConfirmModal from './components/modal';
import ConditionsModal from './components/conditions';
import { Switch } from 'components/switchButton/v2';
import Rules from './components/rules';
import PriceBox from './components/priceBox';
import { useAppSelector, useAppDispatch } from 'store/hook/storeHook';
import {
  selectHasActionOnPrice,
  selectIsPaymentButtonClick,
} from 'store/slices/internationalFlight/selectors/invoice';
import { onActionOnPrice } from 'store/slices/internationalFlight/invoice';
import { notify } from 'utils/notification';
interface InvoiceFactorProps {
  order: GetOrderResponseV2;
  discountHandler?: UseDiscountReturnType;
  refetchOrder: () => void;
}

const InvoiceZeroRefund = ({ order, discountHandler, refetchOrder }: InvoiceFactorProps) => {
  const isPaymentClicked = useAppSelector(selectIsPaymentButtonClick);
  const hasActionOnPrice = useAppSelector(selectHasActionOnPrice);
  const dispatch = useAppDispatch();
  const zeroRefundServices = order?.order?.services?.[0];
  const { isMobile } = useDeviceDetect();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState<boolean>(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean | undefined>(
    zeroRefundServices?.serviceDetail?.[0]?.selected,
  );

  const apiPayload = {
    serviceId:
      zeroRefundServices?.serviceDetail?.[0]?.Id !== undefined
        ? zeroRefundServices?.serviceDetail?.[0]?.Id
        : '',
    orderId: order?.order?.orderId !== undefined ? order?.order?.orderId : '',
  };

  const isDiscountable = zeroRefundServices?.serviceDetail?.[0]?.discountable;

  useEffect(() => {
    if (zeroRefundServices?.serviceDetail?.[0]?.selected) {
      discountHandler?.disableHandler(true);
    }
  }, []);

  const { mutate: mutateApplyPackage, isLoading: isLoadingApply } = useMutation({
    mutationFn: async (payload: TApplyPackage) => {
      dispatch(onActionOnPrice(true));
      return applyPackage(payload);
    },
    mutationKey: 'applyPackage',
    onSuccess: () => {
      refetchOrder();
      discountHandler?.disableHandler(true);
    },
    onError: (error) => {
      setIsSwitchChecked(false);
      notify({ type: 'error', message: (error as Error).toString() });
    },
    onSettled() {
      dispatch(onActionOnPrice(false));
    },
  });

  const { mutate: mutateRemovePackage, isLoading: isLoadingRemove } = useMutation({
    mutationFn: async (payload: TApplyPackage) => {
      dispatch(onActionOnPrice(true));
      return removePackage(payload);
    },
    mutationKey: 'removePackage',
    onSuccess: () => {
      setIsSwitchChecked(false);
      refetchOrder();
      discountHandler?.disableHandler(false);
    },
    onError: (error) => {
      setIsSwitchChecked(true);
      notify({ type: 'error', message: (error as Error).toString() });
    },
    onSettled() {
      dispatch(onActionOnPrice(false));
    },
  });

  const setZeroRefund = (checked: boolean) => {
    setIsSwitchChecked(true);
    setIsModalOpen(false);

    if (checked && !isDiscountable) {
      mutateApplyPackage(apiPayload);
    } else {
    }
  };

  const onSwitchToggle = (checked: boolean) => {
    discountHandler?.clearMessageHandler();
    if (checked && discountHandler?.status === 'applied') {
      setIsModalOpen(true);
      setIsSwitchChecked(checked);
    } else if (checked && discountHandler?.status !== 'applied') {
      setZeroRefund(checked);
    } else if (!checked) {
      mutateRemovePackage(apiPayload);
    }
  };

  const cancelSettingZeroRefund = () => {
    setIsSwitchChecked(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={cn(styles.invoice__table, 'mx-auto')}>
        <div
          className={cn(
            styles.invoice__table__header,
            'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
          )}
        >
          <ZeroRefundIcon />
          <span className="pe-2">{zeroRefundServices?.title}</span>
        </div>

        <div className={cn(styles['zero-refund'], !isMobile && 'px-5 py-3', 'mb-3')}>
          <span className={cn('text-2 p-3 row align-items-center', !isMobile && 'text-3')}>
            <p className="pb-2">{zeroRefundServices?.descriptions?.text?.[0]}</p>
            <div className="col-md-4">
              <h6>{zeroRefundServices?.serviceDetail?.[0]?.title}</h6>
              <div className="d-flex">
                <div className="d-flex">
                  <div className="d-block me-2 mt-1">
                    <p className={styles.description}>
                      {zeroRefundServices?.serviceDetail?.[0]?.description}
                    </p>
                  </div>
                  <div className="mt-1">
                    <Switch
                      disabled={isPaymentClicked || hasActionOnPrice}
                      hasIcon={true}
                      small={true}
                      checked={isSwitchChecked}
                      onChange={onSwitchToggle}
                      loading={isLoadingApply || isLoadingRemove}
                    />
                  </div>
                </div>
              </div>
              <PriceBox order={order} />
            </div>
            <Rules openModal={() => setIsConditionModalOpen(true)} />
          </span>
        </div>
      </div>

      <ConfirmModal
        isModalOpen={isModalOpen}
        cancelSettingZeroRefund={cancelSettingZeroRefund}
        setZeroRefund={setZeroRefund}
        onClose={() => setIsModalOpen(false)}
      />

      <ConditionsModal isOpen={isConditionModalOpen} onShowModal={setIsConditionModalOpen} />
    </>
  );
};

export default InvoiceZeroRefund;
