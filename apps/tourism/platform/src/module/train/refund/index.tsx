import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import cn from 'classnames';

import Modal from 'components/modal';
import Divider from 'components/divider';
import { useResponsive } from 'utils/hooks/useResponsive';
import Button from 'components/button';
import {
  Footer,
  Header,
  PaymentDetails,
  RefundDetails,
  RefundResult,
  SelectTrainId,
} from './components';
import { useTrainRefundPath, getTrainRefundPath } from './hooks';

import styles from './Refund.module.scss';

const TrainRefund = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const { isMobile } = useResponsive();
  const { replace, back } = useRouter();
  const { orderId, trainId, ticketIds, isResultPage } = useTrainRefundPath();

  const handleClose = () => {
    replace('/profile/travels');
  };

  const STEPS = [
    {
      header: { title: 'استرداد' },
      component: <SelectTrainId setAllowSubmit={setAllowSubmit} />,
      footer: {
        title: { mobile: 'مرحله بعد', desktop: 'تایید' },
      },
    },
    {
      header: { title: 'استرداد' },
      component: <RefundDetails setAllowSubmit={setAllowSubmit} />,
      footer: {
        title: { mobile: 'تایید', desktop: 'تایید' },
      },
    },
    {
      header: { title: 'جزئیات استرداد' },
      component: <PaymentDetails setAllowSubmit={setAllowSubmit} />,
      footer: {
        title: { mobile: 'استرداد', desktop: 'استرداد بلیط' },
      },
    },
    {
      header: { title: 'نتیجه استرداد' },
      component: <RefundResult setAllowSubmit={setAllowSubmit} />,
      footer: {
        title: { mobile: 'متوجه شدم', desktop: 'متوجه شدم' },
      },
    },
  ];

  const { header, component, footer } = STEPS[currentStep];

  useEffect(() => {
    if (isResultPage) {
      setCurrentStep(3);
    } else if (ticketIds) {
      setCurrentStep(2);
    } else if (trainId) {
      setCurrentStep(1);
    } else if (orderId) {
      setCurrentStep(0);
    }
  }, [orderId, trainId, ticketIds]);

  return (
    <Modal visible onClose={handleClose}>
      <div
        className={
          isMobile
            ? styles.refund
            : 'container rtl mb-lg-5 w-100 d-flex flex-column bg-color-surface mb-3 rounded'
        }
      >
        <Header isMobile={isMobile} handleBack={back} handleClose={handleClose}>
          {header.title}
        </Header>
        <div className={isMobile ? styles.refund__content : 'd-flex flex-column py-3 px-4'}>
          {component}
        </div>
        {!isMobile && <Divider type="horizontal" className="mb-3" />}
        <Footer isMobile={isMobile} handleBack={back}>
          <Button
            className={
              isMobile ? styles.refund__button : cn(styles['refund__modal__next-btn'], 'mx-1')
            }
            btnType={'submit'}
            form={'train-refund'}
            disabled={!allowSubmit}
            radius
          >
            {isMobile ? footer.title.mobile : footer.title.desktop}
          </Button>
        </Footer>
      </div>
    </Modal>
  );
};

export default TrainRefund;
export { getTrainRefundPath };
