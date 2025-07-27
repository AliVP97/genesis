import { FC } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { VisaPriceInfoProps } from './types';
import styles from '../styles/visaLanding.module.scss';
import cn from 'classnames';
import Image from 'next/image';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';

const VisaPriceInfo: FC<VisaPriceInfoProps> = ({ title, body, image }) => {
  const { isMobile } = useDeviceDetect();
  const { pathname } = useRouter();
  const ImageMobileWidth = 528;
  const ImageDesktopWidth = 984;
  const ImageMobileHeight = 128;
  const ImageDesktopHeight = 154;
  return (
    <div dir="rtl" className={cn(styles['visa-container__content'], 'my-4')}>
      {pathname === '/visa' ? (
        <div className="bg-color-blue-light-4 mt-4 px-4 py-3 rounded-4">
          <h2 className="fs-5 fw-500">{title}</h2>
          {image?.url && (
            <div className="mt-3 text-center">
              <Image
                width={isMobile ? ImageMobileWidth : ImageDesktopWidth}
                height={isMobile ? ImageMobileHeight : ImageDesktopHeight}
                src={image?.url}
                alt="visa"
              />
            </div>
          )}
          {body && <p className="text-justify">{parse(body)}</p>}
        </div>
      ) : (
        <div className="mt-4 py-3">
          <h2 className="fs-5 fw-500">{title}</h2>
          {body && <p className="mt-4 text-justify">{parse(body)}</p>}
          {image?.url && (
            <div className=" d-flex justify-content-center">
              <Image className="rounded-3" width={904} height={472} src={image?.url} alt="visa" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisaPriceInfo;
