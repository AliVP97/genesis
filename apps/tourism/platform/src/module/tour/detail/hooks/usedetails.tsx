import router, { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { notify } from 'utils/notification';
import { useQuery } from 'react-query';
import { getTourDetail } from 'services/tour/v2/detail/api';

export const useDetails = () => {
  const accommodationRef = useRef<HTMLInputElement>(null);
  const policiesRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);
  const itineraryRef = useRef<HTMLInputElement>(null);
  const servicesRef = useRef<HTMLInputElement>(null);
  const handleRefScrolls = (index: number) => {
    const contentElementAccommodation = accommodationRef?.current;
    const contentElementPoliciesRef = policiesRef?.current;
    const contentElementDocumentRef = documentRef?.current;
    const contentItineraryRef = itineraryRef?.current;
    const servicesElementRef = servicesRef?.current;
    switch (index - 1) {
      case 0:
        contentElementAccommodation?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        break;
      case 1:
        servicesElementRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        break;
      case 2:
        contentItineraryRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        break;
      case 3:
        contentElementDocumentRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        break;
      case 4:
        contentElementPoliciesRef?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return;
    }
  };

  const handleTabClick = (index: number) => {
    handleRefScrolls(index);
    const updatedTabBarItem = tabBarItem.map((item) => {
      if (item.id === index) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });

    setTabBarItem(updatedTabBarItem);
  };
  const { isMobile } = useDeviceDetect();

  const { query, pathname } = useRouter();
  const tourId = query.id;
  const [calenderState, setCalenderState] = useState<string>();
  const [localCalenderState, setLocalCalenderState] = useState<string>();
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  const [tabBarItem, setTabBarItem] = useState<
    Array<{ id: number; name: string; isSelected: boolean }>
  >([]);

  const {
    data: tourDetail,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [
      'tour-detail',
      tourId as string,
      (query.dateId as string) || (calenderState as string),
    ],
    queryFn: () =>
      getTourDetail(tourId as string, (query.dateId as string) || (calenderState as string)),
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: <span>{error.response.data.message}</span>,
        config: {
          position: 'top-right',
          hideProgressBar: true,
          draggable: true,
        },
      });
    },
    enabled: true,
  });

  useEffect(() => {
    if (tourDetail) {
      const initialTabBarItems = [
        { id: 2, name: 'خدمات تور', isSelected: false },
        { id: 3, name: 'برنامه سفر', isSelected: false },
        { id: 4, name: 'مدارک مورد نیاز تور', isSelected: false },
        { id: 5, name: 'نکات و قوانین تور', isSelected: false },
      ];

      if (tourDetail.accommodation) {
        initialTabBarItems.unshift({
          id: 1,
          name: 'انتخاب اقامتگاه',
          isSelected: true,
        });
      } else {
        initialTabBarItems[0].isSelected = true;
      }

      setTabBarItem(initialTabBarItems);
    }
  }, [tourDetail?.id]);

  const handleUpdateCalenderState = (id: string) => {
    if (id) {
      setLocalCalenderState(id);
      if (!isMobile) {
        const updatedQuery = { ...query, dateId: id };
        const updatedUrl = {
          pathname,
          query: updatedQuery,
        };

        router.replace(updatedUrl, undefined, { shallow: true });
        setCalenderState(localCalenderState);
      }
    }
  };

  const handleSubmitDate = () => {
    const updatedQuery = {
      ...query,
      dateId: localCalenderState || tourDetail?.calendar?.defaultDate?.id,
    };
    const updatedUrl = {
      pathname,
      query: updatedQuery,
    };

    router.replace(updatedUrl, undefined, { shallow: true });
    setCalenderState(localCalenderState);

    if (isSuccess && tourDetail?.id) {
      handleIsOpenBottomSheet();
    }
  };

  useEffect(() => {
    if (isSuccess && tourDetail?.id && accommodationRef.current && isMobile) {
      accommodationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSuccess, tourDetail?.id]);
  const handleIsOpenBottomSheet = () => {
    setIsOpenBottomSheet((prevState) => !prevState);
  };
  return {
    accommodationRef,
    policiesRef,
    documentRef,
    itineraryRef,
    servicesRef,
    tabBarItem,
    setTabBarItem,
    isOpenBottomSheet,
    isLoading,
    tourDetail,
    handleSubmitDate,
    handleUpdateCalenderState,
    handleIsOpenBottomSheet,
    localCalenderState,
    handleTabClick,
  };
};
