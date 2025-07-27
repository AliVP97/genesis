import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BottomSheet } from 'react-spring-bottom-sheet';

import Button from 'components/button';
import ChanceCard from 'components/userChanceCard';
import { DynamicInvoice } from 'components/DynamicInvoice';
import { DynamicGateways } from 'components/DynamicGateways';
import { usePayment } from './usePayment';
import { TPaymentBottomSheet } from './PaymentBottomSheet.types';
import { definitions } from 'types/payment';
import styles from './PaymentBottomSheet.module.scss';
import PaymentNoticeModal from './PaymentNoticeModal';

type SectionsProps = definitions['paymentBreakdownSection'][];

export const PaymentBottomSheet = ({
  noticeModalText,
  open,
  paymentHookOptions,
  onGatewayChange,
  blocking = false,
  ...props
}: TPaymentBottomSheet) => {
  const { query } = useRouter();
  const { invoice, gateway, isLoading, meta } = usePayment(query?.id as string, paymentHookOptions);
  const [selectedGateWaySections, setSelectedGateWaySections] = useState<SectionsProps>();
  const [shouldOpen, setShouldOpen] = useState(false);
  const [openNoticeModal, setOpenNoticeModal] = useState({ open: false, modalText: '' });

  useEffect(() => {
    if (open) {
      invoice
        .create()
        .then(() => {
          setShouldOpen(true);
        })
        .catch(() => {
          props?.onDismiss?.();
        });
    } else {
      setShouldOpen(false);
      invoice.cancel();
    }
  }, [open]);

  const onConfirmHandler = () => {
    if (openNoticeModal.modalText) {
      setOpenNoticeModal({ ...openNoticeModal, open: true });
    } else {
      gateway.confirm();
    }
  };

  const handleGatewayChange = (gatewayId: number) => {
    gateway.select(gatewayId);
    const selectedGateWay = gateway.data?.filter((item) => item.id === gatewayId);
    if (selectedGateWay) {
      setSelectedGateWaySections(selectedGateWay[0].sections);
      if (selectedGateWay[0].modal) {
        setOpenNoticeModal({ ...openNoticeModal, modalText: selectedGateWay[0].modal });
      } else {
        setOpenNoticeModal({ modalText: '', open: false });
      }
    }

    onGatewayChange?.(gatewayId);
  };

  const Header = () => <div className="py-3">{invoice?.data?.title}</div>;
  const Footer = () => (
    <Button
      className="btn btn-primary d-block w-100"
      onClick={onConfirmHandler}
      loading={isLoading}
      disabled={gateway.data === undefined || gateway.data?.length === 0 || isLoading}
      radius
    >
      تایید
    </Button>
  );

  return (
    <>
      <BottomSheet
        blocking={blocking}
        open={shouldOpen}
        className={styles['bottom-sheet']}
        {...props}
        header={<Header />}
        footer={<Footer />}
      >
        <div dir="rtl" className="px-3 pb-2 pt-1">
          <ChanceCard
            price={String(meta?.price)}
            serviceIdProps={!!meta?.serviceId ? String(meta?.serviceId) : undefined}
            className="mb-2"
          />
          <div className="p-2 pb-3">
            <DynamicInvoice sections={selectedGateWaySections} hasRowSeparator />
          </div>
          <DynamicGateways gateways={gateway?.data} selectGateway={handleGatewayChange} />
        </div>
      </BottomSheet>

      <PaymentNoticeModal
        open={openNoticeModal.open}
        loading={isLoading}
        onClose={() => setOpenNoticeModal({ ...openNoticeModal, open: false })}
        onConfirm={gateway.confirm}
        text={openNoticeModal.modalText}
      />
    </>
  );
};
