import { Dispatch, useEffect, useState } from 'react';

import cn from 'classnames';
import { useMutation } from 'react-query';

import {
  AddPassenger,
  BackArrowIcon,
  CircleAddPassengerIcon,
  CloseIcon,
  EditIcon,
  UserAccountIcon,
} from 'assets/icons';
import Modal from 'components/modal';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { addPassengerV2, deletePassenger, editPassengerV2 } from 'services/general/passenger';
import {
  PassengerPayload,
  TPassengerType,
  TPassengerV2Payload,
} from 'services/general/passenger/interface';
import { notify } from 'utils/notification';
import { TypeProps } from '../tabSelect/interface';
import { deleteLocalStorage, updateLocalStorage } from '../list/utils';
import { formFormatter } from '../tabSelect/helper';
import NationalForm from '../tabSelect/nationalForm';

import styles from '../list/PassengersList.module.scss';
import formStyles from './passengerForm.module.scss';

// import dayjs from 'dayjs';

interface Props {
  formVisible: boolean;
  visible: boolean;
  data: TPassengerType | null;
  onDeleteSuccess: (newState?: PassengerPayload['body']) => void;
  onSubmitPassengers: (newState?: PassengerPayload['body']) => void;
  onCloseModal: (type?: string) => void;
  isAdd: boolean;
  setIsAdd: Dispatch<boolean>;
  containerSize?: string;
}

const PassengerForm = ({
  formVisible,
  visible,
  data,
  onDeleteSuccess,
  onSubmitPassengers,
  onCloseModal,
  isAdd,
  setIsAdd,
  containerSize,
}: Props) => {
  const [tempFormData, setTempFormData] = useState<TPassengerV2Payload>();
  const [, setType] = useState<TypeProps>('nationalCode');
  const { login, setLoginModalVisible } = useAuthContext();

  const { mutate: deletePassengerMutate } = useMutation({
    mutationFn: (id: string) => {
      return deletePassenger(id);
    },
    onSuccess: () => onDeleteSuccess(),
  });

  const { mutate: editPassengerMutate } = useMutation({
    mutationFn: (body: PassengerPayload) => {
      return editPassengerV2(body);
    },
    onSuccess: (e) => onSubmitPassengers(e as PassengerPayload['body']),
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        message: <span className="text-weight-500 fa">{error?.response?.data?.message}</span>,
        type: 'warning',
        config: { position: 'bottom-right' },
      });
    },
  });

  const { mutate: addPassengerMutate, isSuccess } = useMutation({
    mutationFn: (body: TPassengerV2Payload) => {
      return addPassengerV2(body);
    },
    onSuccess: (e) => {
      onSubmitPassengers(e as PassengerPayload['body']);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        message: <span className="text-weight-500 fa">{error?.response?.data?.message}</span>,
        type: 'warning',
        config: { position: 'bottom-right' },
      });
    },
  });
  const { isMobile } = useDeviceDetect();
  const desktopLayout: HTMLElement | null = document?.getElementById('home');
  useEffect(() => {
    if (isAdd) {
      setTimeout(() => {
        desktopLayout?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 1000);
    }
  }, [isAdd]);
  const deleteData = () => {
    const id = data?.id;
    if (login) {
      deletePassengerMutate(id!);
    } else {
      const newState = deleteLocalStorage(id!);
      onDeleteSuccess(newState);
    }
  };
  const handleFormSubmit = (formData: TPassengerType) => {
    const payload = formFormatter(formData);
    if (data) {
      if (login) {
        editPassengerMutate({
          body: payload as PassengerPayload['body'],
          id: data.id as string,
        });
        setIsAdd(false);
      } else {
        const newState = updateLocalStorage(payload);
        onSubmitPassengers(newState);
      }
    } else {
      if (login) {
        addPassengerMutate(payload as TPassengerV2Payload);
      } else {
        setTempFormData(payload as TPassengerV2Payload);
        setLoginModalVisible(true);
      }
    }
  };
  useEffect(() => {
    if (data) {
      if (data?.passengerType === 'PASSENGER_TYPE_NATIONAL_CARD') {
        setType('nationalCode');
      } else {
        setType('passport');
      }
    } else setType('nationalCode');
  }, [data]);

  useEffect(() => {
    if (login) {
      if (tempFormData && Object.keys(tempFormData).length > 0) {
        addPassengerMutate(tempFormData);
      }
    } else {
      setTempFormData(undefined);
    }
  }, [login]);

  return (
    <>
      {isMobile ? (
        <>
          <Modal onClose={() => onCloseModal('form')} visible={formVisible}>
            <div className={formStyles.passengerForm__modal}>
              <div className="h-100 position-relative">
                <div className={formStyles['passengerForm__modal--header']}>
                  <div className={formStyles['passengerForm__modal--icon']}>
                    <BackArrowIcon onClick={() => onCloseModal('form')} />
                  </div>
                  <div className="text-3 text-weight-500 text-center">
                    {data ? 'ویرایش اطلاعات مسافر' : 'افزودن مسافر جدید'}
                  </div>
                </div>
                <div className={formStyles.passengerForm}>
                  <NationalForm
                    handleFormSubmit={handleFormSubmit}
                    editData={data}
                    isSuccess={isSuccess}
                  />
                </div>
              </div>
            </div>
          </Modal>
          <Modal onClose={onCloseModal} visible={visible}>
            <div className={styles.passengerList__modal}>
              <div className={styles['passengerList__modal--header']}>آیا مسافر زیر حذف شود؟</div>
              <div className={styles['passengerList__modal--content']}>
                <UserAccountIcon />
                <span>{data?.persianName + ' ' + data?.persianFamily}</span>
              </div>
              <div className={styles['passengerList__modal--footer']}>
                <button onClick={() => onCloseModal()}>خیر</button>
                <button onClick={deleteData}>حذف شود</button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <>
          {containerSize !== 'md' && (
            <div className={isAdd ? 'd-none' : 'pt-4 my-0 mx-auto'}>
              <button className={styles['passenger__add-passenger']} onClick={() => setIsAdd(true)}>
                <CircleAddPassengerIcon
                  className={cn(styles['passenger__add-passenger__add-icon'])}
                />
                <span>افزودن مسافر جدید</span>
              </button>
            </div>
          )}
          <div
            className={cn(
              styles['passenger__add-detail-passenger'],
              styles['passenger__add-detail-passenger__collapse'],
              isAdd ? styles['passenger__add-detail-passenger__collapse__expand'] : '',
              'border-bottom border-blue-grey pb-3',
            )}
          >
            <div className="d-flex flex-row justify-content-between pb-3">
              <div>
                <AddPassenger className={styles['passenger__add-detail-passenger__add-icon']} />
                <span className="pe-2">مسافر جدید</span>
              </div>
              <div onClick={() => setIsAdd(false)}>
                <CloseIcon className={styles['passenger__add-detail-passenger__close-icon']} />
              </div>
            </div>
            <div className="px-4">
              <NationalForm
                handleFormSubmit={handleFormSubmit}
                editData={null}
                isAdd={isAdd}
                containerSize={containerSize}
                isSuccess={isSuccess}
                footerDescription="با تایید اطلاعات وارد شده، مسافر جدید به لیست مسافران اضافه خواهد شد."
              />
            </div>
          </div>
          <Modal
            visible={formVisible}
            onClose={onCloseModal}
            className={cn(styles['edit-modal'], 'rtl')}
          >
            <div
              className={cn(
                styles['edit-modal__content'],
                'bg-color-white d-flex flex-column w-50',
              )}
            >
              <div className="pb-4">
                <EditIcon className="ms-2" />
                <span>ویرایش اطلاعات مسافر</span>
              </div>
              <div>
                <NationalForm
                  handleFormSubmit={handleFormSubmit}
                  editData={data}
                  closeModal={() => onCloseModal()}
                  isSuccess={false}
                />
              </div>
            </div>
          </Modal>
          <Modal onClose={onCloseModal} visible={visible}>
            <div className={cn(styles.passengerList__modal, 'px-3 w-25')}>
              <div className={styles['passengerList__modal--header']}>آیا مسافر زیر حذف شود؟</div>
              <div className={styles['passengerList__modal--content']}>
                <UserAccountIcon />
                <span>
                  {data?.persianName
                    ? data?.persianName + ' ' + data?.persianFamily
                    : data?.englishName + ' ' + data?.englishFamily}
                </span>
              </div>
              <div className={styles['passengerList__modal--footer']}>
                <button onClick={() => onCloseModal()}>خیر</button>
                <button onClick={deleteData}>حذف شود</button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
export default PassengerForm;
