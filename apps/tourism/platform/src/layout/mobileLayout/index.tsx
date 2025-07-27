import { HTMLAttributes, ReactNode, useEffect } from 'react';

import cn from 'classnames';
import router, { useRouter } from 'next/router';
import Link from 'next/link';

import { MyTicketsIcon, SearchIcon, SupportIcon, BackArrowIcon } from 'assets/icons';
import ServicesTab from 'containers/servicesTab';
import LoginContainer from 'containers/login';
import HeaderIconHoc from 'components/headerIconHoc';
import HeaderProfile from 'components/headerProfile';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { useGuestLogin } from 'utils/hooks/useGuestLogin';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { MainServiceDetector } from 'utils/helpers/serviceDetector';
import { useWebView } from 'utils/hooks/useWebView';
import styles from './mobile-layout.module.scss';
import { getDomesticFlightCardsData } from 'containers/recentSearchCards/helper';
import { NewTopBanner } from 'utils/cms/components/banner';

interface Props {
  children: ReactNode;
  backBtnLocation?: string;
  isLogin?: boolean;
  device?: string;
  isProtected?: boolean;
  title?: string;
  shouldShowServicesTab?: (activeTab: string) => boolean;
  contentElementProps?: HTMLAttributes<HTMLDivElement>;
  hideBackButton?: boolean;
}

const serviceUrlList = [
  'flights',
  'international',
  'bus',
  'international-hotel',
  'hotel',
  'train',
  'tour',
];

export const MobileLayout = ({
  children,
  backBtnLocation,
  device,
  isProtected = false,
  title,
  shouldShowServicesTab = (activeTab: string) => serviceUrlList.includes(activeTab),
  contentElementProps,
  hideBackButton = false,
}: Props) => {
  const { checkAuth, visible } = useAuthContext();
  const isWebView = useWebView();
  const { query, pathname, asPath } = useRouter();
  const activeTab = pathname !== '/' ? pathname.substring(1) : 'flights';
  const serviceName = MainServiceDetector();
  const footerItems = [
    {
      image: (
        <SearchIcon
          className={cn(
            activeTab !== 'travels' && activeTab !== 'support'
              ? 'fill-tertiary'
              : 'fill-on-surface-var',
          )}
        />
      ),
      title: (
        <span
          className={cn(
            activeTab !== 'travels' && activeTab !== 'support'
              ? 'color-tertiary'
              : 'color-on-surface-var',
          )}
        >
          جستجو{' '}
        </span>
      ),
      type: 'search',
      // url: '/',
      url: serviceName === 'flights' || 'travels' || 'support' ? '/' : `/${serviceName}`,
    },
    {
      image: (
        <MyTicketsIcon
          className={cn(activeTab === 'travels' ? 'fill-tertiary' : 'fill-on-surface-var')}
        />
      ),
      title: 'سفر های من',
      type: 'travels',
      url: '/travels',
    },
    {
      image: (
        <SupportIcon
          className={cn(activeTab === 'support' ? 'fill-tertiary' : 'fill-on-surface-var')}
        />
      ),
      title: 'پشتیبانی',
      type: 'support',
      url: '/support',
    },
  ];

  // check login
  useEffect(() => {
    checkAuth({ closable: !isProtected, visible: isProtected });
  }, [pathname]);

  useGuestLogin();

  const isSuperApp = useIsSuperApp();

  const handleBackBtn = () => {
    if (isSuperApp) {
      const pathName = window?.location.pathname;
      const validPaths = [
        '/tourism',
        '/tourism/train',
        '/tourism/bus',
        '/tourism/international',
        '/tourism/hotel',
        '/tourism/tour',
        '/tourism/visa',
        '/tourism/tour',
      ];

      if (validPaths.includes(pathName)) {
        // void router.push('https://pwa.780.ir');
        // window.location.replace('https://pwa.780.ir')
        window.location.href = 'https://pwa.780.ir';
        return;
      }
    }
    if (backBtnLocation) {
      router.push(backBtnLocation);
    } else {
      router.back();
    }
  };

  const returnTitle = (url: string | string[], text: string) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      if (
        (typeof url === 'string' && url === currentPath) ||
        (Array.isArray(url) && url.includes(currentPath))
      ) {
        let newTitle = text;
        if (currentPath.includes('hotel')) {
          newTitle = 'جستجو';
        }
        return <span className="text-2 text-weight-500">{newTitle}</span>;
      }
    }

    return null;
  };

  const tourNameUrl = asPath.split('/', 3)[2];
  const dynamicUrlTour = `/tourism/tour/${tourNameUrl}`;
  const titleElementTour = returnTitle(dynamicUrlTour, `رزرو تور`);
  const passengerTitle = pathname.includes('profile/passengers/v3') ? 'مسافران' : '';
  const invisibleRoutes = ['/tour', '/tour/[type]', '/visa'];
  const isVisibleBackArrowIcon = !isWebView || !invisibleRoutes.includes(pathname);
  const invisibleHeaderRoutes = ['/support', '/profile/support', 'support', 'profile/support'];
  const webviewParam = 'webview' in query;
  const isInvisibleHeader = webviewParam && invisibleHeaderRoutes.includes(pathname);
  const mustExpandedHeight =
    activeTab === 'flights' && !!getDomesticFlightCardsData()?.[0]?.index.toString();

  return (
    <div
      className={cn(styles.mobileLayout, { [styles.mobileLayout__expanded]: mustExpandedHeight })}
    >
      <NewTopBanner />
      {!isInvisibleHeader && (
        <HeaderIconHoc>
          <HeaderProfile isProtected={isProtected} />
        </HeaderIconHoc>
      )}
      {visible && <LoginContainer />}
      {!isInvisibleHeader && (
        <div
          className={cn(
            styles.mobileLayout__header,
            pathname.includes('travels') ? 'pt-3 pe-3 ps-3' : 'p-3',
            !serviceUrlList.includes(activeTab) && styles['mobileLayout__header--shadow'],
          )}
        >
          <div
            className={cn(
              styles.mobileLayout__header__organizer,
              isSuperApp ? styles['is-superapp'] : '',
            )}
            id="header-icon-portal"
          />
          <div
            className={cn(
              styles.mobileLayout__header__portal,
              !pathname.includes('travels') && 'd-flex',
            )}
            id="header-portal"
          >
            {title ||
              returnTitle(
                [
                  '/tourism',
                  '/tourism/flights',
                  '/tourism/train',
                  '/tourism/bus',
                  '/tourism/international',
                  '/tourism/hotel',
                ],
                'جستجوی سفر',
              )}
            {returnTitle('/tourism/visa', 'ویزای توریستی')}
            {returnTitle('/tourism/visa/dubai-visa', 'ویزای توریستی دبی')}
            {returnTitle('/tourism/tour', 'تورهای هف‌هشتاد')}
            {titleElementTour}
            {passengerTitle}
          </div>
          <div className={styles.mobileLayout__header__icon}>
            {isVisibleBackArrowIcon && !hideBackButton && (
              <BackArrowIcon className="fill-on-surface" onClick={handleBackBtn} />
            )}
          </div>
        </div>
      )}
      {/* TODO connect TopBanner to CMS as marketing tool */}
      {/* {pathname === '/train' && <TopBanner />} */}
      {shouldShowServicesTab(activeTab) && <ServicesTab device={device} activeTab={activeTab} />}
      <div
        {...contentElementProps}
        id="mobile-layout"
        className={cn(styles.mobileLayout__content, contentElementProps?.className)}
      >
        {children}
      </div>
      {isSuperApp && !pathname.includes('passengers/v3') && (
        <div
          className={cn(styles.mobileLayout__footer, 'd-flex flex-row-reverse align-items-center')}
        >
          {footerItems.map((item, index) => (
            <Link key={index.toString() + item.url} href={item.url} passHref>
              <div
                key={index.toString() + 'mobileLayout' + item.url}
                className="col text-center d-flex flex-column"
              >
                <div className={styles.mobileLayout__icons}>{item.image}</div>
                <span className={cn(activeTab === item.type && 'color-tertiary')}>
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
