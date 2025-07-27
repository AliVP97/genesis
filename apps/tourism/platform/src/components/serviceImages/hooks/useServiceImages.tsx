import { useRouter } from 'next/router';
import {
  bus,
  DomesticFlightLanding,
  globalHotel,
  internationlFlight,
  localHotel,
  tourismHome,
  train,
  TourBannerDesktop,
} from 'assets/images';
import { useMemo } from 'react';

const servicesItems = [
  'receipt',
  'travels',
  'support',
  'terms-and-conditions',
  'profile',
  '/international/[id]/passengers',
  '/international/checkout/[id]',
  '/international/issuance/[id]',
  '/tour/detail',
];

const stepperItems = ['checkout', 'passenger', 'issuance', 'review', 'add-leaders', 'detail'];

const serviceBackgroundItems = {
  flights: DomesticFlightLanding,
  international: internationlFlight,
  train: train,
  bus: bus,
  'international-hotel': globalHotel,
  hotel: localHotel,
  review: DomesticFlightLanding,
  tourism: tourismHome,
  tour: TourBannerDesktop,
};

export const useServiceImages = () => {
  const { pathname } = useRouter();

  const activeTab: string = pathname === '/' ? 'tourism' : pathname.split('/')[1];

  const showBackground = useMemo(() => {
    return !servicesItems.some((item) => pathname.includes(item));
  }, [pathname]);

  const showStepper = useMemo(() => {
    if (pathname.startsWith('/profile/passengers') || pathname.startsWith('/tour/detail')) {
      return;
    }
    return stepperItems.some((item) => pathname.includes(item));
  }, [pathname]);

  const image = serviceBackgroundItems[activeTab as keyof typeof serviceBackgroundItems];

  return {
    backgroundImage: image ?? DomesticFlightLanding,
    showBackground,
    showStepper,
  };
};
