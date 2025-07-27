import classNames from 'classnames';
import React from 'react';
import { BusInfo } from 'services/bus/tickets/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './refund.module.scss';

interface Props {
  data: BusInfo;
}
const RefundPolicy = ({ data }: Props) => {
  const { isMobile } = useDeviceDetect();

  const policyContent = {
    penalties: (
      <div className="p-3">
        {data?.refundPolicy?.map((item, i) => (
          <div key={i.toString() + item?.percent} className={styles['refund__container']}>
            <div className={styles['refund__title']}>{item.percent}% جریمه:</div>
            <div className={styles['refund__content']}>{item.text}</div>{' '}
            {data.refundPolicy && data?.refundPolicy.length - 1 != i && (
              <div className={styles['refund__divider']} />
            )}
          </div>
        ))}
      </div>
    ),
  };
  return (
    <div
      dir="rtl"
      className={classNames(!isMobile && 'bg-color-white-1', 'p-1')}
      style={{
        borderRadius: !isMobile ? '8px' : '0',
        width: !isMobile ? '97%' : '100%',
      }}
    >
      <div>
        <span className="color-grey-1 text-3">{policyContent.penalties}</span>
      </div>
    </div>
  );
};

export default RefundPolicy;
