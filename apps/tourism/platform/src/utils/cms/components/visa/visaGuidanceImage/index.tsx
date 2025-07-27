import { FC } from 'react';
import { VisaGuidanceImageProps } from './types';
import Image from 'next/image';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const VisaGuidanceImage: FC<VisaGuidanceImageProps> = ({ desktop, mobile }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className="d-flex justify-content-center mb-5 mt-4">
      {isMobile ? (
        <Image src={mobile?.url ?? ''} alt="Visa guidance image" width={440} height={831} />
      ) : (
        <Image src={desktop?.url ?? ''} alt="Visa guidance image" width={612} height={343} />
      )}
    </div>
  );
};

export default VisaGuidanceImage;
