import cn from 'classnames';
import styles from './serviceImages.module.scss';
import Image from 'next/image';
import Stepper from 'containers/stepper';
import { useServiceImages } from './hooks/useServiceImages';
import { useRouter } from 'next/router';

export const ServiceImages = () => {
  const { backgroundImage, showBackground, showStepper } = useServiceImages();
  const { pathname } = useRouter();

  return (
    <div className={cn(styles['service-images'])}>
      {showBackground &&
        !pathname.includes('hotel/detail') &&
        !pathname.includes('hotel/add-leaders') &&
        !pathname.includes('hotel/checkout') && (
          <Image
            src={backgroundImage}
            alt="bg-logo"
            priority
            layout="intrinsic"
            width={1920}
            height={528}
            objectFit="cover"
            quality={75}
          />
        )}
      {showStepper && <Stepper />}
    </div>
  );
};
