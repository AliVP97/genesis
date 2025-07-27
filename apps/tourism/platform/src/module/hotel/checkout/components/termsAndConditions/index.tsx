import { CheckIn, CheckOut } from 'assets/icons';
import Divider from 'components/divider';
import { TCheckTime } from 'services/hotel/orders/interface';
import useDeviceDetect from '../../../../../utils/hooks/useDeviceDetect';

export const TermsAndConditions = ({
  // content,
  checkTime,
}: {
  content: string;
  checkTime: TCheckTime;
}) => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="p-3 rtl text-3">
      <div className="px-2">
        <div className="d-flex mb-2">
          <div className="d-flex col-6 align-items-center">
            <CheckIn /> <span className="me-2">ساعت ورود</span>
          </div>
          <div className="col-6 text-start">{checkTime.checkIn}</div>
        </div>
        <div className="d-flex">
          <div className="d-flex col-6 align-items-center">
            <CheckOut /> <span className="me-2">ساعت خروج</span>
          </div>
          <div className="col-6 text-start">{checkTime.checkOut}</div>
        </div>
      </div>
      {isMobile && (
        <div className="py-2">
          <Divider type="horizontal" />
        </div>
      )}

      {/* {content} */}
    </div>
  );
};
