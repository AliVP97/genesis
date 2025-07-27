import { ReactNode, useEffect } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Header from 'components/header';
import ServicesTab from 'containers/servicesTab';
import LoginContainer from 'containers/login';

import { useAuthContext } from 'utils/hooks/useAuthContext';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { serviceAvailables } from 'utils/interface';
import { ServiceImages } from 'components/serviceImages';
import { NewTopBanner } from 'utils/cms/components/banner';

interface Props {
  children: ReactNode;
  isProtected?: boolean;
  isServiceImageShown?: boolean;
}

export const Layout = ({ children, isProtected = false, isServiceImageShown = true }: Props) => {
  const { pathname } = useRouter();

  const isServiceAvailable = () => {
    return serviceAvailables?.some((path) => path === pathname);
  };

  const { visible, checkAuth } = useAuthContext();

  useEffect(() => {
    checkAuth({ closable: !isProtected, visible: isProtected });
  }, [pathname]);

  const activeTab = pathname !== '/' ? pathname.substring(1) : 'flights';

  useGuestLogin();

  return (
    <>
      <div className="home" id="home">
        <NewTopBanner />
        {/* TODO connect TopBanner to CMS as marketing tool */}
        {/* {pathname === '/train' && <TopBanner />} */}
        <Header />

        {isServiceImageShown && <ServiceImages />}
        <div className="container-xxl">
          {visible && <LoginContainer />}
          <div className={cn(pathname.includes('[id]') ? 'row mt-5' : 'row')}>
            {isServiceAvailable() && <ServicesTab activeTab={activeTab} />}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
