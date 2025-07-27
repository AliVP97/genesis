import { DomesticFlightLanding } from 'assets/images';
import Header from 'components/header';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { customLoader } from '../../utils/helpers/imageLoader';
import styles from './landing-layout.module.scss';
import cn from 'classnames';
import ServicesTab from 'containers/servicesTab';
import Services from 'containers/landingPage/components/services';
import Footer from '../../containers/landingPage/components/footer';
import { NewTopBanner } from 'utils/cms/components/banner';

interface Props {
  children: ReactNode;
  device?: string;
}
const LandingLayout = ({ children, device }: Props) => {
  const { pathname } = useRouter();
  const activeTab: string = pathname === '/' ? 'flights' : pathname.split('/')[1];

  const backgroundUrl = () => {
    switch (activeTab) {
      case 'flights':
        return DomesticFlightLanding;
      default:
        return DomesticFlightLanding;
    }
  };

  return (
    <>
      <div className={cn(device === 'desktop' ? styles.landing : styles['landing-mobile'])}>
        <NewTopBanner />
        {device === 'desktop' ? <Header /> : ''}
        <div
          className={cn(
            styles.landing__header,
            device === 'mobile' ? 'd-none' : '',
            'container-fluid px-0 text-center',
          )}
        >
          <Image
            className={cn(styles.landing__image, 'd-none d-md-block')}
            loader={customLoader}
            src={backgroundUrl()}
            alt="bg-logo"
            unoptimized
          />
        </div>
        <div className="container-xxl">
          <div className="row">
            <div className={cn(styles['landing__service-tab'])}>
              {activeTab && <ServicesTab device={device} activeTab={activeTab} />}
            </div>
          </div>
          <div className="px-4 rtl">
            <Services />
            {children}
          </div>
        </div>

        <div className="container-fluid px-0 text-center">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingLayout;
