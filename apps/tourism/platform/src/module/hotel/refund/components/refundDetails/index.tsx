import React from 'react';
import styles from '../../refund.module.scss';
import cn from 'classnames';
import RefundDetailsRoom from './refundDetailsRoom';
import {PenaltyDataResponse} from '../../hooks/useHotelPenalty/types';

type TRefundRoomsProps = {
  penaltyData?: PenaltyDataResponse;
};

const RefundDetails = ({penaltyData}: TRefundRoomsProps) => {
  return (
    <>
      <div className="rtl">
        <div className={cn(styles['refund__modal__rooms'], 'px-3 py-3')}>
          {React.Children.toArray(
            penaltyData?.rooms?.map((item, index) => (
              <>
                <RefundDetailsRoom
                  key={index.toString() + item?.roomId}
                  room={item}
                />
              </>
            )),
          )}
        </div>
      </div>
    </>
  );
};

export default RefundDetails;
