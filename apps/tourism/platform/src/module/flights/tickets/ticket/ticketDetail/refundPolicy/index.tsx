import classNames from 'classnames';
import React from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { TicketType } from '../../interface';
import styles from './refund.module.scss';

interface Props {
  data: TicketType;
}
const RefundPolicy = ({ data }: Props) => {
  const { isMobile } = useDeviceDetect();

  const policyContent = {
    penalties: (
      <div className="p-1">
        {data?.refundPolicy?.map((item, i) => (
          <div key={i} className={styles['refund__container']}>
            <div className={styles['refund__title']}>{item.Percent}% جریمه:</div>
            <div className={styles['refund__content']}>{item.Text}</div>
          </div>
        ))}
        <br />
      </div>
    ),
  };
  return (
    <div
      dir="rtl"
      className={classNames(!isMobile && 'bg-color-white-1', 'p-3')}
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
