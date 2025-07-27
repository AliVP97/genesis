import React, {
  Dispatch,
  ReactElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import PassengerListMobile from './passengerListMobile';
import PassengerListDesktop from './passengerListDesktop';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllPassenger, updatePassenger } from 'services/passenger';
import { MoreButtonContext } from './../../context/MoreButtonContext';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Header from './../header/index';
import RemovePassenger from '../deletePassenger/removePassenger';
import Modal from 'components/modal';
import AddPassenger, {
  ErrorResponse,
  payloadMapper,
} from 'components/passenger/components/addPassenger/addPassenger';
import styles from './passengerList.module.scss';
import Button from 'components/button';
import usePassenger, { PassengerModel } from 'components/passenger/hooks/usePassenger';
import { useRouter } from 'next/router';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import { Control, FieldValues, useForm, UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AddPassengerPayload } from 'services/passenger/interface';
import { notify } from 'utils/notification';

import Leader from './leader';
import { passengerExtractor } from 'components/passenger/utils/passengerExtractor';
import { cloneDeep } from 'lodash';
export type PassengerLeader = {
  phoneNumber?: string;
  selectedLeader?: PassengerModel;
};
export type ServiceName =
  | 'rajatrain'
  | 'international-bus'
  | 'domestic-bus'
  | 'domestic-flight'
  | 'international-flight'
  | 'cinema'
  | 'international-hotel'
  | 'domestic-hotel'
  | 'passenger';
export type AddLeaderCallBack = (
  passengerLeader: PassengerLeader,
  selectedPassengers: PassengerModel[],
) => void;
type PassengerList = {
  serviceName: ServiceName;
  isConfirmButton?: boolean;
  addPassengers?: (passengers: PassengerModel[]) => void;
  isConfirmButtonLoading?: boolean;
  isConfirmButtonDisabled?: boolean;
  OptionComponent?: ReactElement<any, any>;
  addSelectedPassengers?: Dispatch<React.SetStateAction<PassengerModel[]>>;
  addPassengerLeader?: (passenger: PassengerLeader) => void;
  selectLeader?: boolean;
  addLeaderCallBack?: AddLeaderCallBack;
  addLeaderCallBackLoading?: boolean;
  addLeader?: () => boolean;
  maxSelectable?: number;
  selectedPassengers?: string[];
  disabledPassengers?: string[];
  backButton?: () => void;
  showSelectedCount?: boolean;
  lockSelection?: boolean;
  refrenceDate?: string;
};

export type LeaderForm = {
  control: Control<FieldValues, object>;
  label: string;
  id: string;
  setValue: UseFormSetValue<FieldValues>;
  resetField: UseFormResetField<FieldValues>;
  errors: {
    [x: string]: any;
  };
};
const phoneSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, { message: 'شماره موبایل صحیح نیست' })
    .regex(/^(0098|\\+?98|0)?(9[0-9]{9})$/, {
      message: 'شماره موبایل صحیح نیست',
    }),
});

const PassengerList = forwardRef((props: PassengerList, ref) => {
  const {
    serviceName,
    addPassengers,
    isConfirmButton,
    isConfirmButtonLoading,
    isConfirmButtonDisabled,
    OptionComponent,
    addSelectedPassengers,
    addPassengerLeader,
    selectLeader = false,
    addLeaderCallBack,
    addLeader,
    maxSelectable,
    disabledPassengers,
    selectedPassengers: preSelectedPassengers,
    addLeaderCallBackLoading,
    backButton,
    showSelectedCount = false,
    lockSelection = false,
    refrenceDate,
  } = props;
  const { isMobile } = useDeviceDetect();
  const [selectedPassengers, setSelectedPassengers] = useState<PassengerModel[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedAfterAdd, setSelectedAfterAdd] = useState<string>();
  const router = useRouter();
  const { data: passengerData, isLoading } = useQuery(
    ['passengerList', serviceName, refrenceDate],
    () => getAllPassenger(serviceName, refrenceDate),
  );

  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      if (preSelectedPassengers && passengerData?.passengers) {
        const arrOfPreSelected: PassengerModel[] = [];
        preSelectedPassengers.forEach((item) => {
          const passenger = passengerData?.passengers?.find((passItem) => {
            return passItem.id === item;
          });
          const modfiedPassenger = passengerExtractor(passenger?.fields) as PassengerModel;
          if (modfiedPassenger) {
            modfiedPassenger.ageType = passenger?.ageType;
            modfiedPassenger.id = passenger?.id as string;
          }

          arrOfPreSelected.push(modfiedPassenger);
        });
        if (arrOfPreSelected.length > 0) {
          setSelectedPassengers(arrOfPreSelected);
        }
        firstLoad.current = false;
      }
    }
  }, [passengerData, preSelectedPassengers]);

  const [leader, setLeader] = useState<PassengerLeader>();
  const queryClient = useQueryClient();
  const { mutateAsync: updatePassengerData, isLoading: isLoadingUpdateLeader } = useMutation(
    (data: AddPassengerPayload) => {
      return updatePassenger(data, leader?.selectedLeader?.id as string);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('passengerList');

        // Additional success logic
      },
      onError: (error) => {
        notify({
          type: 'error',
          message: (error as ErrorResponse)?.response?.data?.message,
        });
        // Error handling logic, e.g., display a message
      },
    },
  );

  const addLeaderCall = async () => {
    if (!leader?.selectedLeader) {
      notify({
        type: 'error',
        message: 'انتخاب سرپرست ضروری میباشد',
      });
      return false;
    }
    const valid = await trigger();
    if (!valid) {
      return false;
    }
    if (leader?.selectedLeader?.phoneNumber !== leader?.phoneNumber) {
      const payload = payloadMapper(leader?.selectedLeader as Record<string, string>);
      payload.push({ id: 'phoneNumber', value: leader.phoneNumber as string });
      await updatePassengerData({
        fields: payload,
        serviceName: { serviceName: serviceName },
      });
      return true;
    } else if (leader?.selectedLeader?.phoneNumber === leader?.phoneNumber) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (addLeader) {
      addLeaderCall();
    }
  }, [addLeader]);
  useImperativeHandle(ref, () => ({
    showAddModal(newState: boolean) {
      setAddModal(newState);
    },
  }));
  const {
    control,
    watch,
    formState: { errors },
    resetField,
    trigger,
    setValue,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(phoneSchema),
  });

  const leaderForm: LeaderForm = {
    control: control,
    label: 'شماره موبایل',
    id: 'mobileNumber',
    resetField: resetField,
    errors: errors,
    setValue: setValue,
  };
  const phoneNumber = watch('mobileNumber');

  useEffect(() => {
    if (!errors.phoneNumber && phoneNumber) {
      setLeader({
        phoneNumber: phoneNumber,
        selectedLeader: leader?.selectedLeader,
      });
    }
  }, [phoneNumber, errors.phoneNumber]);
  const [leaderVisible, setLeaderVisible] = useState(false);

  useEffect(() => {
    if (leader && addPassengerLeader) {
      addPassengerLeader(leader);
    }
  }, [leader, addPassengerLeader]);
  useEffect(() => {
    if (addSelectedPassengers && selectedPassenger) {
      addSelectedPassengers(selectedPassengers);
    }
  }, [addSelectedPassengers, selectedPassengers]);
  const [selectedPassenger, setSelectedPassenger] = useState({
    id: '',
    name: '',
  });
  const selectedPassengerData = useMemo(() => {
    return passengerData?.passengers?.find((item) => {
      if (item.id === selectedPassenger.id) {
        return item;
      }
    });
  }, [selectedPassenger]);
  const leaderCallBack = async () => {
    const addLeader = await addLeaderCall();
    const cloneSelected = cloneDeep(selectedPassengers);

    if (addLeader) {
      addLeaderCallBack &&
        leader &&
        selectedPassengers &&
        addLeaderCallBack(
          leader,
          cloneSelected.filter((item) => {
            return !disabledPassengers?.includes(item?.id as string);
          }),
        );
    }
  };
  const passengers = usePassenger({
    list: passengerData?.passengers,
    filter: '',
  });
  useEffect(() => {
    const selectableLength = (maxSelectable || 0) + (disabledPassengers?.length || 0);
    if (selectedAfterAdd && passengers && selectableLength > selectedPassengers.length) {
      const passenger = passengers.find((item) => {
        return item.id === selectedAfterAdd;
      });
      if (passenger?.persianName || passenger?.englishName) {
        setSelectedPassengers([...selectedPassengers, passenger]);
        setSelectedAfterAdd(undefined);
      }
    }
  }, [selectedAfterAdd, passengers]);
  let isConfirmDisabled = false;
  if (maxSelectable) {
    isConfirmDisabled = selectedPassengers.length !== maxSelectable && lockSelection;
  }
  const confirmButton = () => {
    let isPassengersContainAdult = false;
    selectedPassengers.forEach((item) => {
      if (item.ageType === 'AGE_TYPE_ADULT') {
        isPassengersContainAdult = true;
      }
    });
    if (!isPassengersContainAdult) {
      notify({
        type: 'error',
        message: ' برای انتخاب کودک و نوزاد حضور حداقل یک بزرگسال الزامی است',
      });
      return;
    }
    selectLeader && isMobile && setLeaderVisible(true);
    addPassengers && addPassengers(selectedPassengers);
  };
  return (
    <>
      <MoreButtonContext.Provider
        value={{
          setEditModal,
          setDeleteModal,
          setAddModal,
          setSelectedPassenger,
          setLeader,
          editModal,
          addModal,
          deleteModal,
          selectedPassenger,
          selectedPassengers,
          setSelectedPassengers,
          disabledPassengers,
          selectedAfterAdd,
          setSelectedAfterAdd,
          leader,
        }}
      >
        {isMobile ? (
          <PassengerListMobile
            leaderForm={leaderForm}
            serviceName={serviceName}
            isLoading={isLoading}
            passengerData={passengerData}
            maxSelectable={maxSelectable}
            showSelectedCount={showSelectedCount}
            refrenceDate={refrenceDate}
          />
        ) : (
          passengerData && (
            <PassengerListDesktop
              leaderForm={leaderForm}
              serviceName={serviceName}
              passengerData={passengerData}
              isLoading={isLoading}
              maxSelectable={maxSelectable}
              showSelectedCount={showSelectedCount}
              selectLeader={selectLeader}
              refrenceDate={refrenceDate}
            />
          )
        )}

        <Modal visible={deleteModal}>
          <RemovePassenger
            fullName={selectedPassenger.name}
            id={selectedPassenger.id}
            close={() => {
              setDeleteModal(false);
            }}
          />
        </Modal>
        <Modal visible={editModal}>
          <div className={styles['container']}>
            <Header
              title="ویرایش مسافر"
              setShow={() => {
                setEditModal(false);
              }}
            />
            <div className={styles['container__form']}>
              <AddPassenger
                serviceName={serviceName}
                passengerData={selectedPassengerData?.fields}
                passengerId={selectedPassengerData?.id}
              />
            </div>
          </div>
        </Modal>
        <Modal visible={addModal}>
          <div className={styles['container']}>
            <Header
              title="افزودن مسافر جدید"
              setShow={() => {
                setAddModal(false);
              }}
            />
            <div className={styles['container__form']}>
              <AddPassenger serviceName={serviceName} />
            </div>
          </div>
        </Modal>

        {isConfirmButton && isMobile && (
          <Button
            loading={isConfirmButtonLoading}
            disabled={
              isConfirmButtonDisabled || selectedPassengers?.length === 0 || isConfirmDisabled
            }
            onClick={() => {
              confirmButton();
            }}
            className={styles['confirm-btn']}
          >
            تایید و ادامه
          </Button>
        )}
        {OptionComponent && OptionComponent}
        {isConfirmButton && !isMobile && (
          <div className="d-flex justify-content-center">
            <div className={styles['footer']}>
              <Button
                radius
                btnType="submit"
                className="btn btn-primary d-block px-5"
                onClick={() => {
                  selectLeader ? leaderCallBack() : confirmButton();
                }}
                disabled={Object.keys(selectedPassengers)?.length === 0 || isConfirmDisabled}
                loading={isConfirmButtonLoading || isLoading || addLeaderCallBackLoading}
              >
                تایید و ادامه
              </Button>
              <button
                className="btn btn-outline-secondary d-block px-5 rounded ms-3"
                onClick={() => (backButton ? backButton() : router.back())}
              >
                بازگشت
              </button>
            </div>
          </div>
        )}
        {/* <BottomSheet
          header={<span className="text-3">انتخاب سرپرست مسافران</span>}
          className={styles['bottom-sheet']}
          open={leaderVisible}
          onDismiss={() => setLeaderVisible(!leaderVisible)}
        >
          <div className={styles['bottom-sheet']}>
            <Leader leaderForm={leaderForm} />

            <Button
              loading={isLoadingUpdateLeader || addLeaderCallBackLoading}
              onClick={leaderCallBack}
              className={styles['confirm-btn-leader']}
            >
              تایید و ادامه
            </Button>
          </div>
        </BottomSheet> */}
        <SwipeableBottomSheet
          open={leaderVisible}
          onChange={setLeaderVisible}
          bodyStyle={{
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          <div className={styles['bottom-sheet']}>
            <span className="text-3">انتخاب سرپرست مسافران</span>
            <div className={styles['bottom-sheet']}>
              <Leader leaderForm={leaderForm} />
              <Button
                loading={isLoadingUpdateLeader || addLeaderCallBackLoading}
                onClick={leaderCallBack}
                className={styles['confirm-btn-leader']}
              >
                تایید و ادامه
              </Button>
            </div>
          </div>
        </SwipeableBottomSheet>
        {/* <Modal
          // header={<span className="text-3">انتخاب سرپرست مسافران</span>}
          // className={styles['bottom-sheet']}
          bottomSheetStyles={styles['bottom-sheet']}
          visible={leaderVisible}
          onClose={() => setLeaderVisible(!leaderVisible)}
          bottomSheet
        >
          <div className={styles['bottom-sheet']}>
            <Leader leaderForm={leaderForm} />

            <Button
              loading={isLoadingUpdateLeader || addLeaderCallBackLoading}
              onClick={leaderCallBack}
              className={styles['confirm-btn-leader']}
            >
              تایید و ادامه
            </Button>
          </div>
        </Modal> */}
      </MoreButtonContext.Provider>
    </>
  );
});
PassengerList.displayName = 'PassengerList';
export default PassengerList;
