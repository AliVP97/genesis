import { ReactElement, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Button from 'components/button';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { NotFound404 } from 'assets/icons';
import { TourLayout } from '../layout/tourLayout';
import Footer from '../containers/landingPage/components/footer';
import { MobileLayout } from '../layout/mobileLayout';
import { useAppDispatch, useAppSelector } from 'store/hook/storeHook';
import { selectNotFoundRedirectUrl } from 'store/slices/app/selectors/redirectUrl';
import { clearNotFoundRedirectUrl } from 'store/slices/app/app';
import URLS from 'utils/routes/web';

/**
 * Handles redirection after a not-found scenario.
 *
 * @Case1 Client-side redirects to 404 page or home page.
 * @example
 * // A place where we want to redirect to 404 page.
 * dispatch(notFoundRedirectUrlChanged('/path-to-redirect'));
 * router.replace('/404');
 *
 * // A place where we want to redirect back to the previous page.
 * const notFoundRedirectUrl = useAppSelector(selectNotFoundRedirectUrl);
 *
 * dispatch(clearNotFoundRedirectUrl());
 * router.push(notFoundRedirectUrl);
 *
 * ______________________________________________________________________________
 *
 * @Case2 Server-side 404 redirects to home page.
 * @example
 *  if (router.asPath.startsWith(URLS.INTERNATIONAL)) {
 *    router.push(URLS.INTERNATIONAL);
 *  }
 *
 * @returns redirect back to previous page or home page based on conditions.
 */
const useRedirectAfterNotFound = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notFoundRedirectUrl = useAppSelector(selectNotFoundRedirectUrl);

  /**
   * Redirects to the previous page or fallback to home page if no previous URL is available.
   */
  const handleRedirect = useCallback(() => {
    // Case 1: Server-side redirection based on route
    const returnPath = [URLS.INTERNATIONAL, URLS.DOMESTIC].find((path) =>
      router.asPath.startsWith(path),
    );
    if (returnPath) {
      router.push(returnPath);
      return;
    }

    // Case 2: Redirect to the previous page (client-side redirection)
    if (notFoundRedirectUrl) {
      router.push(notFoundRedirectUrl);
      dispatch(clearNotFoundRedirectUrl());
      return;
    }

    // Case 3: Redirect to home page
    router.push('/');
  }, [dispatch, notFoundRedirectUrl, router]);

  useEffect(() => {
    const timeout = setTimeout(handleRedirect, 5000);

    return () => {
      clearTimeout(timeout);
      dispatch(clearNotFoundRedirectUrl());
    };
  }, [dispatch, handleRedirect]);

  return { handleRedirect };
};

const CustomNotFound = () => {
  const { isMobile } = useDeviceDetect();
  const { handleRedirect } = useRedirectAfterNotFound();

  return (
    <>
      <div className="d-flex justify-content-center my-5">
        <NotFound404 />
      </div>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <p className="fs-6 fw-bold">صفحه مورد نظر یافت نشد</p>
        <p className={cn(isMobile ? 'fs-4 w-100 text-center' : 'fs-4 w-50 text-center')}>
          متاسفانه صفحه مورد نظر شما پیدا نشد. می‌توانید از طریق لینک زیر به صفحه گردشگری هف‌هشتاد
          بازگردید.
        </p>
        <Button
          className="bg-color-primary color-white rounded-pill px-5 mb-5"
          onClick={handleRedirect}
          loading={false}
        >
          بازگشت به صفحه اصلی
        </Button>
      </div>
    </>
  );
};
export default CustomNotFound;

CustomNotFound.getLayout = function getLayout(page: ReactElement) {
  return page.props.device == 'desktop' ? (
    <>
      <TourLayout>{page}</TourLayout>
      <Footer />
    </>
  ) : (
    <>
      <MobileLayout {...page.props}>{page}</MobileLayout>
      <Footer />
    </>
  );
};
