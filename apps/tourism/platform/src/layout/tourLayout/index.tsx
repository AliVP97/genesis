import Header from 'components/header';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serviceAvailables } from '../../utils/interface';
import { useAuthContext } from '../../utils/hooks/useAuthContext';
import { useGuestLogin } from '../../utils/hooks/useGuestLogin';
import LoginContainer from '../../containers/login';
import cn from 'classnames';
import ServicesTab from '../../containers/servicesTab';
import { NewTopBanner } from 'utils/cms/components/banner';

interface TProps {
  children: ReactNode;
  isProtected?: boolean;
}
export const TourLayout = ({ children, isProtected = false }: TProps) => {
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
    <div>
      <NewTopBanner />
      <Header />

      <div>
        {visible && <LoginContainer />}
        <div className={cn(pathname.includes('[id]') ? 'row mt-5' : null)}>
          {isServiceAvailable() && <ServicesTab activeTab={activeTab} />}
          {children}
        </div>
      </div>
    </div>
  );
};
