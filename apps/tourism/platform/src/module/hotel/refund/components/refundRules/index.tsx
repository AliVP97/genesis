import cn from 'classnames';

import styles from './refundRules.module.scss';
import {PenaltyDataResponse} from '../../hooks/useHotelPenalty/types';
type RefundRulesProps = {
  cancelationRules?: {
    penalty?: string;
    text?: string;
  }[];
  hotelType?: string;
  penaltyData?: PenaltyDataResponse;
};

const RefundRules = ({
  cancelationRules,
  hotelType,
  penaltyData,
}: RefundRulesProps) => {
  return (
    <>
      {hotelType === 'INTERNATIONAL_HOTEL' ? (
        <div className="rtl">
          {penaltyData?.rooms?.map(room => (
            <>
              <div className={cn(styles['refund-room'], 'mt-4')}>
                <div
                  className={cn(
                    styles['refund-room__header'],
                    'px-3 p-2 d-flex justify-content-between',
                  )}
                >
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="d-flex align-items-center">
                      <span className={'color-grey-24'}>
                        {room?.name || '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <div className="d-flex justify-content-between pt-3">
                    <p>{room?.refundPolicy}</p>
                  </div>

                  <div className=" justify-content-between pt-3">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="color-grey-19">قوانین کنسلی</span>
                      <span className="color-grey-19">میزان جریمه</span>
                    </div>
                    {room?.policy?.map((policy, policyIndex) => (
                      <div
                        key={policyIndex}
                        className="d-flex justify-content-between mt-2"
                      >
                        {policy.text && <span>{policy.text}</span>}
                        {policy.penalty && <span>{policy.penalty}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      ) : (
        <div className="rtl p-3">
          {cancelationRules?.map(item => {
            return <>{item?.text}</>;
          })}
        </div>
      )}
    </>
  );
};

export default RefundRules;
