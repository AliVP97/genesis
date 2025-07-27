import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAddPassengers, useOrder, usePassengers } from 'module/bus/hooks';
import {
  fetchPassengerList,
  PassengerPayload,
  TPassengerType,
  TPassengerV2Response,
} from 'services/general/passenger/interface';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useIsSuperApp } from 'utils/hooks/useIsSuperApp';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { notify } from 'utils/notification';
import WEB from 'utils/routes/web';

interface ModalProps {
  data?: TPassengerType | null;
}

export type UsePassengerListReturnType = {
  setLoginModalVisible: (visible: boolean) => void;
  login: boolean;
  isMobile: boolean | undefined;
  pathname: string;
  selected: TPassengerType[];
  maxPassenger: number;
  openSearch: boolean;
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
  dropdownId: string;
  setDropdownId: Dispatch<SetStateAction<string>>;
  visible: boolean;
  isPassengers: string | 'd-block' | 'd-none';
  formVisible: boolean;
  setFormVisible: Dispatch<SetStateAction<boolean>>;
  localPassengers: PassengerPayload['body'][];
  leaderId: string;
  setLeaderId: Dispatch<SetStateAction<string>>;
  data: TPassengerType | null;
  passenger?: TPassengerV2Response;
  isFetching: boolean;
  passengerLoading: boolean;
  searchButtonClicked: boolean;
  setSearchButtonClicked: Dispatch<SetStateAction<boolean>>;
  routeChangeStarted: boolean;
  search?: string;
  isAdd: boolean;
  setIsAdd: Dispatch<SetStateAction<boolean>>;
  onDeleteSuccess: (newState?: PassengerPayload['body']) => void;
  onSubmitPassengers: (newState?: PassengerPayload['body']) => void;
  selectPassenger: (passenger: TPassengerType) => void;
  selectLeader: (passenger: TPassengerType) => void;
  onCloseModal: () => void;
  changeFormModal: ({ data }: ModalProps) => void;
  changeModal: ({ data }: ModalProps) => void;
  handleSubmitPassengers: () => void;
  handleInput: (e: ChangeEvent<HTMLInputElement>) => string;
  isSuperapp: boolean;
  nationalityNotificationModalIsVisible: boolean;
  handleNationalityNotificationModalOnClose: () => void;
  passengerInvalidInfoNotificationModalIsVisible: boolean;
  handleInvalidPassengerNotificationModalOnClose: () => void;
  handleInvalidPassengerNotificationOnConfirm: () => void;
  isLoading: boolean;
  isTravel: boolean;
  hasPassenger: boolean;
  goToLeaderSelect: () => void;
  isReadyToSubmit: boolean;
  isLeaderPage: boolean;
};

export const usePassengersList = (singleSelect: boolean): UsePassengerListReturnType => {
  const [selected, setSelected] = useState<TPassengerType[]>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [dropdownId, setDropdownId] = useState('');
  const [visible, setVisible] = useState(false);
  const [isPassengers, setIsPassengers] = useState('d-block');
  const [formVisible, setFormVisible] = useState(false);
  const [localPassengers, setLocalPassengers] = useState<PassengerPayload['body'][]>([]);
  const [latestPassengerId, setLatestPassengerId] = useState<string>();
  const [leaderId, setLeaderId] = useState<string>('');
  const [data, setData] = useState<TPassengerType | null>(null);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [search, setSearch] = useState<string>();
  const [isAdd, setIsAdd] = useState(false);
  const [nationalityNotificationModalIsVisible, setNationalityNotificationModalIsVisible] =
    useState(false);
  const handleNationalityNotificationModalOnClose = () => {
    setNationalityNotificationModalIsVisible(false);
  };
  const [selectedInvalidPassenger, setSelectedInvalidPassenger] = useState<
    TPassengerType | undefined
  >();
  const [
    passengerInvalidInfoNotificationModalIsVisible,
    setPassengerInvalidInfoNotificationModalIsVisible,
  ] = useState(false);
  const [isLeaderPage, setIsLeaderPage] = useState<boolean>(false);
  const [maxPassenger, setMaxPassenger] = useState<number>(0);

  const { setLoginModalVisible, login } = useAuthContext();
  const { isMobile } = useDeviceDetect();
  const isSuperapp = useIsSuperApp();
  const { pathname, query, prefetch, push } = useRouter();

  const { data: passenger, refetch, isFetching, isLoading: passengerLoading } = usePassengers();

  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();

  const { data: orderData } = useOrder(query.id as string);

  useEffect(() => {
    if (orderData?.seats) {
      setMaxPassenger(orderData.seats.length);
    }
  }, [orderData]);

  const isLoading = useMemo(() => passengerLoading || isFetching, [passengerLoading, isFetching]);

  const isTravel = useMemo(() => pathname.includes('travels'), [pathname]);

  const hasPassenger = useMemo(() => {
    if (!isLoading) {
      if (passenger) {
        return !((passenger as fetchPassengerList)?.passengerList?.length === 0);
      }
      return false;
    }
    return true;
  }, [passenger, isLoading]);

  const isReadyToSubmit = useMemo(
    () => leaderId.length > 0 && selected.length === maxPassenger,
    [leaderId, selected, maxPassenger],
  );

  const onCloseModal = () => {
    setFormVisible(false);
    setVisible(false);
    setData(null);
  };

  const updateSelectedPassengers = (selectedPassenger: TPassengerType) => {
    if (singleSelect) {
      return setSelected([selectedPassenger]);
    } else {
      if (selected.length === 0) {
        return setSelected([selectedPassenger]); // no need to filter for first item
      } else {
        const currentPassengerIndex = selected.findIndex(
          (item) => item.id === selectedPassenger.id,
        );

        if (currentPassengerIndex !== -1) {
          return setSelected(selected.filter((item) => item.id !== selectedPassenger.id));
        } else if (selected.length >= maxPassenger) {
          return notify({
            config: {
              position: 'bottom-center',
              hideProgressBar: true,
            },
            message: `${maxPassenger} مسافر در این سفارش قابل انتخاب می‌باشد.`,
            type: 'warning',
          });
        } else {
          return setSelected([selectedPassenger, ...selected]);
        }
      }
    }
  };

  const changeFormModal = ({ data: modalData }: ModalProps) => {
    if (!modalData) {
      onCloseModal();
      return;
    }
    setFormVisible(true);

    const [BirthYear, BirthMonth, BirthDay] = modalData.hijriBirthdayString?.split('-') || [];

    setData({ ...modalData, BirthYear, BirthMonth, BirthDay });
  };

  const closeModal = () => {
    changeFormModal({ data: null });
    if (data) {
      updateSelectedPassengers({ id: data.id } as TPassengerType);
    }
    refetch();
  };

  const onDeleteSuccess = (newState?: PassengerPayload['body']) => {
    if (!newState) {
      refetch();
      onCloseModal();
    } else {
      // setLocalPassengers(newState);
      onCloseModal();
    }
    setSelected(selected.filter((selectedItem) => selectedItem.id !== data?.id));
  };

  const onSubmitPassengers = (newState?: PassengerPayload['body']) => {
    if (!newState) {
      closeModal?.();
    } else {
      if (newState.id) {
        setLatestPassengerId(newState.id);
      }
      // setLocalPassengers(newState);
      closeModal?.();
    }
  };

  const selectPassenger = (selectedPassenger: TPassengerType) => {
    const iranian = selectedPassenger?.nationality === 'IR';
    const persianFirstName = selectedPassenger?.persianName;
    const persianLastName = selectedPassenger?.persianFamily;
    const englishName = selectedPassenger?.englishName;
    const englishFamily = selectedPassenger?.englishFamily;
    const phoneNumber = selectedPassenger?.phoneNumber;
    const gender = selectedPassenger?.gender;
    const nationalId = selectedPassenger?.nationalId;
    const birthday = selectedPassenger?.birthday;
    const passportId = selectedPassenger?.passportId;
    const passportExpireDate = selectedPassenger?.passportExpireDate;

    const requiredProperties =
      persianFirstName &&
      persianLastName &&
      phoneNumber &&
      gender &&
      nationalId &&
      birthday &&
      (orderData?.busInfo?.isInternational
        ? englishName && englishFamily && passportId && passportExpireDate
        : true);

    if (!iranian) {
      setNationalityNotificationModalIsVisible(true);
    } else if (!requiredProperties) {
      setSelectedInvalidPassenger(selectedPassenger);
      setPassengerInvalidInfoNotificationModalIsVisible(true);
    } else updateSelectedPassengers(selectedPassenger);
  };

  const selectLeader = (selectedPassenger: TPassengerType) => {
    const iranian = selectedPassenger?.nationality === 'IR';
    const persianFirstName = selectedPassenger?.persianName;
    const persianLastName = selectedPassenger?.persianFamily;
    const phoneNumber = selectedPassenger?.phoneNumber;
    const gender = selectedPassenger?.gender;
    const nationalId = selectedPassenger?.nationalId;
    const requiredProperties =
      persianFirstName && persianLastName && phoneNumber && gender && nationalId;
    if (!iranian) {
      setNationalityNotificationModalIsVisible(true);
    } else if (!requiredProperties) {
      setSelectedInvalidPassenger(selectedPassenger);
      setPassengerInvalidInfoNotificationModalIsVisible(true);
    } else {
      if (selectedPassenger.id) {
        setLeaderId(selectedPassenger.id);
      }
    }
  };

  const changeModal = ({ data: modalData }: ModalProps) => {
    if (!modalData) {
      onCloseModal();
      return;
    }
    setVisible(true);
    setData(modalData);
  };

  const { mutate: addBusPassengerMutate } = useAddPassengers(query.id as string, {
    onSuccess: () => {
      push(`${WEB.BUS}checkout/${query.id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
      setSearchButtonClicked(false);
    },
  });

  const handleSubmitPassengers = () => {
    addBusPassengerMutate({
      leaderUserId: leaderId,
      passengerIds: selected.map(({ id }) => id || ''),
    });
  };

  const goToLeaderSelect = () => {
    if (leaderId) {
      handleSubmitPassengers();
    } else {
      setIsLeaderPage(true);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target?.value;
    setSearch(inputValue);
    return inputValue;
  };

  const handleInvalidPassengerNotificationModalOnClose = () => {
    setPassengerInvalidInfoNotificationModalIsVisible(false);
  };

  const handleInvalidPassengerNotificationOnConfirm = () => {
    handleInvalidPassengerNotificationModalOnClose();
    changeFormModal({ data: selectedInvalidPassenger });
  };

  useEffect(() => {
    const localPassengerData = JSON.parse(sessionStorage.getItem('passengers') as string);

    if (localPassengerData) setLocalPassengers(localPassengerData);

    prefetch(`${WEB.BUS}checkout/${query.id}`);
  }, []);

  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  useEffect(() => {
    if (maxPassenger === 1 && selected?.[0]?.id) {
      setLeaderId(selected?.[0].id);
    } else if (selected.findIndex(({ id }) => id === leaderId) === -1) {
      setLeaderId('');
    }
  }, [selected]);

  useEffect(() => {
    if (login) {
      if (!passengerLoading) {
        if ((passenger as fetchPassengerList)?.passengerList?.length || localPassengers?.length) {
          setIsPassengers('d-block');
          setIsAdd(false);
        } else {
          setIsPassengers('d-none');
          setIsAdd(true);
        }
      }
    } else {
      setIsPassengers('d-none');
      setIsAdd(true);
    }
  }, [passenger, localPassengers.length]);

  useEffect(() => {
    const latestPassenger =
      latestPassengerId &&
      (passenger?.passengerList?.find(({ id }) => id === latestPassengerId) as TPassengerType);

    if (!isFetching) {
      if (latestPassenger) {
        updateSelectedPassengers(latestPassenger);
        setLatestPassengerId('');
      }
    }
  }, [passenger]);

  useEffect(() => {
    if (passenger && orderData) {
      if (orderData.passengers?.leaderUserId) {
        setLeaderId(orderData.passengers.leaderUserId);
      }
      if (orderData.passengers?.passengersInfo && orderData.passengers.passengersInfo?.length > 0) {
        const selectedIds = orderData.passengers.passengersInfo.map((item) => item.userId);

        const selectedPassengers = passenger?.passengerList?.filter(({ id }) =>
          selectedIds.includes(id),
        ) as TPassengerType[];

        if (selectedPassengers) {
          setSelected(selectedPassengers);
        }
      }
    }
  }, [passenger, orderData]);

  return {
    setLoginModalVisible,
    login,
    isMobile,
    pathname,
    selected,
    maxPassenger,
    openSearch,
    setOpenSearch,
    dropdownId,
    setDropdownId,
    visible,
    isPassengers,
    formVisible,
    setFormVisible,
    localPassengers,
    leaderId,
    setLeaderId,
    data,
    passenger,
    isFetching,
    passengerLoading,
    searchButtonClicked,
    setSearchButtonClicked,
    routeChangeStarted,
    search,
    isAdd,
    setIsAdd,
    onDeleteSuccess,
    onSubmitPassengers,
    selectPassenger,
    selectLeader,
    onCloseModal,
    changeFormModal,
    changeModal,
    handleSubmitPassengers,
    handleInput,
    isSuperapp,
    nationalityNotificationModalIsVisible,
    handleNationalityNotificationModalOnClose,
    passengerInvalidInfoNotificationModalIsVisible,
    handleInvalidPassengerNotificationModalOnClose,
    handleInvalidPassengerNotificationOnConfirm,
    isLoading,
    isTravel,
    hasPassenger,
    goToLeaderSelect,
    isReadyToSubmit,
    isLeaderPage,
  };
};
