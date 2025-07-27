import cn from 'classnames';
import RadioElement from 'components/radio';
import { TRefundReason } from '../types';

type RefundResaonStepProps = {
  selectedReason: TRefundReason;
  setSelectedReason: React.Dispatch<React.SetStateAction<TRefundReason>>;
};

const RefundResaonStep = ({ selectedReason, setSelectedReason }: RefundResaonStepProps) => {
  return (
    <>
      <div className="rtl">
        <p>لطفا دلیل استرداد خود را انتخاب نمایید</p>
        <div className="px-md-3">
          <div className="bg-color-surface rounded-pill px-4 py-2 mb-3">
            <RadioElement
              label="طبق قوانین کنسلی پرواز"
              checked={selectedReason === 'REFUNDREASON_BY_CRCN'}
              onChange={() => setSelectedReason('REFUNDREASON_BY_CRCN')}
              value="REFUNDREASON_BY_CRCN"
              className={cn('p-1')}
            />
          </div>
          <div className="bg-color-surface rounded-pill px-4 py-2 mb-3">
            <RadioElement
              label="ابطال از طرف ایرلاین"
              checked={selectedReason === 'REFUNDREASON_FLIGHT_CANCELED'}
              onChange={() => setSelectedReason('REFUNDREASON_FLIGHT_CANCELED')}
              value="REFUNDREASON_FLIGHT_CANCELED"
              className={cn('p-1')}
            />
          </div>
          <div className="bg-color-surface rounded-pill px-4 py-2 mb-3">
            <RadioElement
              label="تاخیر و تعجیل بالای دو ساعت"
              checked={selectedReason === 'REFUNDREASON_FLIGHT_DELAYED'}
              onChange={() => setSelectedReason('REFUNDREASON_FLIGHT_DELAYED')}
              value="REFUNDREASON_FLIGHT_DELAYED"
              className={cn('p-1')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundResaonStep;
