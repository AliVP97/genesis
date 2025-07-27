import { Dispatch, useEffect, useState } from 'react';

import cn from 'classnames';
import { useMutation, useQuery } from 'react-query';
import dayjs from 'dayjs';

import {
  AddBlackIcon,
  AddPassenger,
  BackArrowIcon,
  CloseIcon,
  EditIcon,
  UserAccountIcon,
} from 'assets/icons';
import {
  NationalFormProps,
  PassportFormProps,
  TypeProps,
} from 'module/flights/passengers/tabSelect/interface';
import Modal from 'components/modal';
import { deleteLocalStorage, updateLocalStorage } from 'module/flights/passengers/list/helper';
import { formFormatter } from 'module/flights/passengers/tabSelect/helper';
import RadioElement from 'components/radio';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { Select } from 'module/flights/passengers/list/interface';
import NationalForm from 'module/flights/passengers/tabSelect/nationalForm';
import PassportForm from 'module/flights/passengers/tabSelect/passportForm';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import {
  addPassengerV2,
  deletePassenger,
  editPassenger,
  getCountriesList,
} from 'services/general/passenger';
import { PassengerPayload, TPassengerV2Payload } from 'services/general/passenger/interface';
import { notify } from 'utils/notification';

import styles from 'module/flights/passengers/list/passengerList.module.scss';
import formStyles from './passengerForm.module.scss';

interface Props {
  formVisible: boolean;
  visible: boolean;
  data: (PassengerPayload['body'] & { countryId?: string }) | null;
  onDeleteSuccess: (newState?: PassengerPayload['body'][]) => void;
  onSubmitPassengers: (newState?: PassengerPayload['body'][]) => void;
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
  const [type, setType] = useState<TypeProps>('nationalCode');
  const { login } = useAuthContext();
  const { data: countries } = useQuery('countries', getCountriesList, {
    enabled: false, //set enabled to true if purchase by passport is available in business
  });

  const { mutate: deletePassengerMutate } = useMutation({
    mutationFn: (id: string) => {
      return deletePassenger(id);
    },
    onSuccess: () => onDeleteSuccess(),
  });

  const { mutate: editPassengerMutate } = useMutation({
    mutationFn: (body: PassengerPayload) => {
      return editPassenger(body);
    },
    onSuccess: () => onSubmitPassengers(),
  });

  const { mutate: addPassengerMutate, isSuccess } = useMutation({
    mutationFn: (body: TPassengerV2Payload) => {
      return addPassengerV2(body);
    },
    onSuccess: () => {
      onSubmitPassengers();
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
  const handleFormSubmit = (formData: NationalFormProps | PassportFormProps) => {
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
        payload.birthday = dayjs(payload.birthday).unix().toString();
        payload.passportExpireDate = dayjs(payload.passportExpireDate).unix().toString();
        addPassengerMutate(payload as TPassengerV2Payload);
      } else {
        const newState = updateLocalStorage(payload);
        onSubmitPassengers(newState);
      }
    }
  };
  useEffect(() => {
    if (data) {
      setType('passport');
    } else setType('nationalCode');
  }, [data]);

  const passengerMessage = data ? 'ویرایش اطلاعات مسافر' : 'افزودن مسافر جدید';
  const activeClass = (currentType: 'nationalCode' | 'passport') =>
    currentType === type ? formStyles['passengerForm__type--active'] : '';
  const containerClass = isAdd ? 'd-none' : 'pt-4 my-0 mx-auto';
  const detailPassengerClass = isAdd
    ? styles['passenger__add-detail-passenger__collapse__expand']
    : '';
  const footerDescription =
    containerSize === 'md'
      ? 'با تایید اطلاعات وارد شده، مسافر جدید به لیست مسافران اضافه خواهد شد.'
      : undefined;
  const RenderForm = type === 'nationalCode' ? NationalForm : PassportForm;
  const FormComponent = type === Select.WithNationalCode ? NationalForm : PassportForm;
  let displayName;
  if (data?.persianName) {
    displayName = `${data.persianName} ${data.persianFamily}`;
  } else {
    displayName = `${data?.englishName} ${data?.englishFamily}`;
  }

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
                  <div className="text-3 text-weight-500 text-center">{passengerMessage}</div>
                </div>
                <div className={formStyles.passengerForm__type}>
                  <button
                    className={activeClass('nationalCode')}
                    onClick={() => setType('nationalCode')}
                  >
                    خرید با کد ملی
                  </button>
                  <button className={activeClass('passport')} onClick={() => setType('passport')}>
                    خرید با پاسپورت
                  </button>
                </div>
                <div className={formStyles.passengerForm}>
                  <RenderForm
                    handleFormSubmit={handleFormSubmit}
                    editData={data}
                    isSuccess={isSuccess}
                    options={type !== 'nationalCode' ? countries?.countries : []}
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
            <div className={containerClass}>
              <button
                className={cn(
                  styles['passenger__add-passenger'],
                  'bg-color-white text-3 color-primary',
                )}
                onClick={() => setIsAdd(true)}
              >
                <AddBlackIcon className={cn(styles['passenger__add-passenger__add-icon'])} />
                <span>افزودن مسافر جدید</span>
              </button>
            </div>
          )}
          <div
            className={cn(
              styles['passenger__add-detail-passenger'],
              styles['passenger__add-detail-passenger__collapse'],
              detailPassengerClass,
              'border-bottom border-blue-grey pb-3',
            )}
          >
            <div className="d-flex flex-row justify-content-between pb-3">
              <div>
                <AddPassenger className={styles['passenger__add-detail-passenger__add-icon']} />
                <span className="color-grey-1 pe-1">بزرگسال</span>
              </div>
              <div onClick={() => setIsAdd(false)}>
                <CloseIcon className={styles['passenger__add-detail-passenger__close-icon']} />
              </div>
            </div>
            <div className="d-flex flex-row px-4">
              <RadioElement
                className="text-3 ms-3"
                checked={type === Select.WithNationalCode}
                value={Select.WithNationalCode}
                label={'خرید با کدملی'}
                onChange={(value: Select) => setType(value)}
              />
              <RadioElement
                className="text-3"
                checked={type === Select.WithPassport}
                value={Select.WithPassport}
                label={'خرید با پاسپورت'}
                onChange={(value: Select) => setType(value)}
              />
            </div>
            <div className="px-4">
              <FormComponent
                handleFormSubmit={handleFormSubmit}
                editData={null}
                isAdd={isAdd}
                containerSize={containerSize}
                isSuccess={isSuccess}
                footerDescription={footerDescription}
                options={type !== Select.WithNationalCode ? countries?.countries : []}
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
              <div>
                <EditIcon className="ms-2" />
                <span>ویرایش اطلاعات مسافر</span>
              </div>
              <div className="d-flex flex-row">
                <RadioElement
                  className="text-3 ms-3"
                  checked={type === Select.WithNationalCode}
                  value={Select.WithNationalCode}
                  label={'خرید با کدملی'}
                  onChange={(value: Select) => setType(value)}
                />
                <RadioElement
                  className="text-3"
                  checked={type === Select.WithPassport}
                  value={Select.WithPassport}
                  label={'خرید با پاسپورت'}
                  onChange={(value: Select) => setType(value)}
                />
              </div>
              <div>
                <FormComponent
                  handleFormSubmit={handleFormSubmit}
                  editData={data}
                  closeModal={onCloseModal}
                  isSuccess={isSuccess}
                  options={type !== Select.WithNationalCode ? countries?.countries : []}
                />
              </div>
            </div>
          </Modal>
          <Modal onClose={onCloseModal} visible={visible}>
            <div className={cn(styles.passengerList__modal, 'px-3 w-25')}>
              <div className={styles['passengerList__modal--header']}>آیا مسافر زیر حذف شود؟</div>
              <div className={styles['passengerList__modal--content']}>
                <UserAccountIcon />
                <span>{displayName}</span>
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
