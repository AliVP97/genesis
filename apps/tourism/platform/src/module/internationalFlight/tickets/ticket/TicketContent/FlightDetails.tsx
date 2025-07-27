import React, { useRef } from 'react';
import { components } from 'types/international-flight';
import Chip from './Chip';
import styles from './FlightDetails.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Popover from './Popover';
import cn from 'classnames';

type Flight = components['schemas']['InternationalFlightPb.FlightV2'];
type CabinType = components['schemas']['InternationalFlightPb.CabinTypeDetail'];

const REFUNDABLE = 'قابل استرداد';

interface FlightDetailsProps {
  flight: Flight | undefined;
  isCodeShare: boolean | undefined;
  cabinType: CabinType | undefined;
  flightType: string | undefined;
  providerName: string | undefined;
}

function getRefundType(refundType: string | undefined): string | undefined {
  if (!refundType) {
    return undefined;
  }

  if (refundType !== REFUNDABLE) {
    return refundType;
  }

  return undefined;
}

const FlightDetails = ({
  flight,
  cabinType,
  isCodeShare,
  flightType,
  providerName,
}: FlightDetailsProps) => {
  const refundType = getRefundType(flight?.refundType);
  const cabinTypeTitle = cabinType?.cabinTypeTitle;
  const { isMobile } = useDeviceDetect();
  const codeShareRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="d-flex gap-2">
      <Chip variation={'highlight'}>{cabinTypeTitle}</Chip>
      {Boolean(flightType) && <Chip variation={'highlight'}>{flightType}</Chip>}
      {!isMobile && isCodeShare && (
        <Popover
          className={cn(styles.popover, 'd-none')}
          anchorEl={codeShareRef.current}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
            offset: { left: -(codeShareRef.current?.clientWidth ?? 0) },
          }}
        >
          <p className={'mb-2'}>
            بلیط پرواز توسط یک ایرلاین صادر می‌شود, ولی پرواز توسط ایرلاین دیگری انجام خواهد شد.
          </p>
          <p className={'m-0'}>(اطلاعات بیشتر را در جزئیات بلیط مشاهده نمایید)</p>
        </Popover>
      )}
      {refundType && <Chip variation={'warning'}>{refundType}</Chip>}
      {providerName && (
        <div className="me-auto">
          <Chip variation={'highlight'}>{providerName}</Chip>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
