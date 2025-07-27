import { FC, ReactNode } from 'react';

import cn from 'classnames';

import Button from 'components/button';
import { InfoIcon } from 'assets/icons';

import styles from '../Refund.module.scss';

type TFooterProps = {
  isMobile: boolean;
  handleBack: () => void;
  children: ReactNode;
};

export const Footer: FC<TFooterProps> = ({ isMobile, handleBack, children }) => {
  return (
    <>
      <div className={'d-flex justify-content-end align-items-center mb-3'}>
        <div className="flex-grow-1 d-flex">
          <InfoIcon className={'mx-2'} />
          <div>
            <div>میزان جریمه با توجه به زمان استرداد متفاوت است.</div>
            <a
              className="font-4"
              href="https://780.ir/page/tourism-terms"
              target="_blank"
              rel="noreferrer"
            >
              مشاهده جدول درصد جریمه
            </a>
          </div>
        </div>
        {!isMobile && (
          <Button
            radius
            className={cn(styles['refund__modal__prev-btn'], 'mx-1 bg-color-surface')}
            onClick={handleBack}
          >
            <span className={cn(styles['refund__modal__prev-btn_text'])}>بازگشت</span>
          </Button>
        )}
        {children}
      </div>
    </>
  );
};
