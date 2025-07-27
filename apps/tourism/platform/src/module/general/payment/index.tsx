import Button from 'components/button';
import { DynamicGateways } from 'components/DynamicGateways';
import { DynamicInvoice } from 'components/DynamicInvoice';
import PaymentNoticeModal from 'components/PaymentBottomSheet/PaymentNoticeModal';
import { usePayment } from 'components/PaymentBottomSheet/usePayment';
import Spinner from 'components/spinner';
import ChanceCard from 'components/userChanceCard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './payment.module.scss';
import { BackArrowIcon, Logo } from 'assets/icons';
import { definitions } from 'types/payment';
import Countdown, { TimerProps } from 'components/countdown';

type CurrentGatewayProps =
  | {
      id: number;
      name: string;
      paymentType: string;
      paymentMethod: string;
      label: string;
      fee: string;
      balance: string;
      expireDate: string;
      sections: definitions['paymentBreakdownSection'][];
      toast: string;
      modal: string;
    }
  | Record<PropertyKey, never>;

const DesktopPayment = () => {
  const { query, back } = useRouter();
  const { invoice, gateway, isLoading, meta } = usePayment(query?.id as string);
  const [openNoticeModal, setOpenNoticeModal] = useState({ open: false, modalText: '' });
  const [disablePayment, setDisablePayment] = useState(false);
  const [currentGateway, setCurrentGateway] = useState<CurrentGatewayProps>({});

  const handleGatewayChange = (gatewayId: number) => {
    gateway.select(gatewayId);
    const selectedGateWay = gateway.data?.filter((item) => item.id === gatewayId) ?? [];
    setCurrentGateway(selectedGateWay[0] as CurrentGatewayProps);
  };

  const onConfirmHandler = () => {
    if (currentGateway?.modal) {
      setOpenNoticeModal({ modalText: currentGateway.modal, open: true });
    } else {
      gateway.confirm();
    }
  };

  useEffect(() => {
    const paymentJwt = sessionStorage.getItem('paymentJwt');
    if (query.id && paymentJwt) {
      invoice.create();
    } else if (!paymentJwt) {
      toast.error('اطلاعات سفارش یافت نشد!', { autoClose: 3000 });
    }
  }, [query.id]);

  return (
    <div dir="rtl">
      <div className={styles['payment-header']}>
        <Logo />
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles['payment-container']}>
          <div className={styles['payment-title']}>
            <BackArrowIcon onClick={() => back()} /> <span>تایید نهایی و پرداخت</span>
          </div>
          <div className={styles['data-section']}>
            <div className={styles['payment-item']}>
              <div className="pb-3">روش پرداخت</div>
              <DynamicGateways
                gateways={gateway?.data}
                selectGateway={handleGatewayChange}
                wrapperClassNames={styles['gateway-wrapper']}
              />
            </div>
            <div className={styles['invoice-item']}>
              <div className={styles['invoice-title']}>{invoice.data.title}</div>
              <DynamicInvoice sections={currentGateway.sections} />
              {meta?.price && (
                <ChanceCard
                  price={String(meta?.price)}
                  serviceIdProps={!!meta?.serviceId ? String(meta?.serviceId) : undefined}
                  className="mb-2 mt-4"
                />
              )}
              <Button
                className="btn btn-primary w-100 mt-4 position-relative"
                onClick={onConfirmHandler}
                loading={isLoading && !openNoticeModal}
                disabled={
                  gateway.data === undefined ||
                  gateway.data?.length === 0 ||
                  isLoading ||
                  disablePayment
                }
                radius
              >
                <span>تایید و پرداخت</span>
                {!disablePayment && gateway?.data && (
                  <Countdown
                    duration={300}
                    onFinish={() => setDisablePayment(true)}
                    resetTime={false}
                    type={TimerProps.MINUTES}
                    wrapperClassName={styles['countdown-wrapper']}
                    numberClassName={styles['countdown-number']}
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <PaymentNoticeModal
        open={openNoticeModal.open}
        loading={isLoading}
        onClose={() => setOpenNoticeModal({ ...openNoticeModal, open: false })}
        onConfirm={gateway.confirm}
        text={openNoticeModal.modalText}
      />
    </div>
  );
};

export default DesktopPayment;
