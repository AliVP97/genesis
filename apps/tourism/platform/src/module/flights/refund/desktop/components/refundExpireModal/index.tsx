import classNames from 'classnames';
import expireModalStyles from 'containers/expireModal/expireModal.module.scss';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import Modal from 'components/modal';
import React, { useEffect, useState } from 'react';
import { useGetImages } from 'module/general/config/hooks/useGetImages';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { TSteps } from '../../types';
import { TicketsRefundInfo } from 'services/domestic/refund/interface';

let timeout: ReturnType<typeof setTimeout>;

type RefundExpireModalProps = {
  step: TSteps;
  calcRefundData?: TicketsRefundInfo;
  calcRefundHandler: () => void;
  onClose: () => void;
};

const RefundExpireModal = ({
  step,
  calcRefundData,
  calcRefundHandler,
  onClose,
}: RefundExpireModalProps) => {
  const { timeOut } = useGetImages();
  const [expireModal, setExpireModal] = useState<boolean>(false);
  const { isMobile } = useDeviceDetect();

  useEffect(() => {
    if (step === 'finalMessage') {
      clearTimeout(timeout);
    }
  }, [step]);

  useEffect(() => {
    if (calcRefundData) {
      timeout = setTimeout(
        () => setExpireModal(true),
        Number(calcRefundData?.elapsedTime) * 1000 || 10 * 60 * 1000,
      );
    }
    return () => clearTimeout(timeout);
  }, [calcRefundData]);

  return (
    <Modal
      className="d-flex justify-content-center align-items-center"
      onClose={() => null}
      backdropDisable={true}
      visible={expireModal}
    >
      <div
        className={classNames(
          isMobile ? expireModalStyles['modal'] : expireModalStyles['desktop-modal'],
        )}
      >
        <div
          className={
            isMobile ? expireModalStyles['modal__image'] : expireModalStyles['desktop-modal__image']
          }
        >
          <Image
            loader={customLoader}
            src={timeOut}
            alt="no search found"
            width="240"
            height="180"
            unoptimized
          />
        </div>
        <div className={expireModalStyles['modal__text']}>
          <span className={isMobile ? 'mt-3 rtl' : 'text-5 mt-3 rtl'}>
            نتایج و اعداد محاسبه شده ممکن است معتبر نباشد.
          </span>

          <span className={isMobile ? 'pt-2 rtl' : 'pt-2 text-5 rtl'}>
            برای اطمینان از نمایش بروزترین نتایج لطفا بروزرسانی کنید.
          </span>
        </div>
        <div
          className={classNames(
            'd-flex justify-content-evenly pt-4 align-items-center',
            isMobile ? 'flex-column' : '',
          )}
        >
          <button
            className={
              isMobile ? expireModalStyles['modal__btn'] : expireModalStyles['desktop-modal__btn']
            }
            onClick={() => {
              setExpireModal(false);
              calcRefundHandler();
            }}
          >
            به‌روز‌رسانی مجدد{' '}
          </button>
          <div
            className={classNames(
              'color-grey-1 text-center text-3',
              !isMobile && expireModalStyles['desktop-modal__return-btn'],
            )}
            onClick={() => {
              onClose();
            }}
          >
            بازگشت به صفحه سفرها{' '}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RefundExpireModal;
