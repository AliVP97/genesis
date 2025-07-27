import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import Button from 'components/button';
import Divider from 'components/divider';
import EditPassengerForm from 'containers/passengers/edit/v2';
import { normalizeEditPassengerPayload } from 'module/flights/travels/components/passengers/list/edit/utils/normalizeEditPassengerPayload';
import UseEditPassenger from 'module/internationalFlight/passenger/hooks/useUpdatePassenger';
import {
  TFormPassportCountry,
  formsSchema,
  mapForm2Payload,
  mapPayload2Form,
} from 'module/train/passengers/form';
import { PassengerV2EditPayload, TPassengerV2 } from 'services/general/passenger/interface';
import Header from '../mobileView/header';

import { Edit } from 'assets/icons';
import styles from './edit.module.scss';

type TEditPassengerProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
  setEditModal: (e: boolean) => void;
};

const EditPassenger = ({ passenger, getPassengers, setEditModal }: TEditPassengerProps) => {
  const { query } = useRouter();

  const { editPassenger, isLoading, isSuccess } = UseEditPassenger(getPassengers);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = (data: Record<string, string | number | TFormPassportCountry | undefined>) => {
    const payload: PassengerV2EditPayload = {
      id: passenger.id || '',
      body: mapForm2Payload(data, query?.isInternational === 'true'),
    };
    editPassenger(normalizeEditPassengerPayload(payload, passenger));
  };

  useEffect(() => {
    if (isSuccess) setEditModal(false);
  }, [isSuccess]);

  const handelClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <div className={styles['edit-modal']}>
        <div className="d-md-none">
          <Header title="ویرایش مسافر" setShow={setEditModal} />
        </div>
        <div className="d-none d-md-block">
          <Edit />
          <span className="pe-2">ویرایش اطلاعات مسافر</span>
        </div>
        <div className="p-4 pt-5 pb-0">
          <EditPassengerForm
            showSubmit={false}
            forms={formsSchema(query?.isInternational === 'true')}
            ref={formRef}
            onSubmit={onSubmit}
            loading={isLoading}
            btnValue="ویرایش مسافر"
            defaultValues={mapPayload2Form(passenger)}
          />
          <Divider type="horizontal" className="d-none d-md-block" />
          <div className="d-flex mt-3 justify-content-end mb-4 mb-md-0">
            <Button
              radius
              className="btn border bg-color-white color-black  d-block px-5 ms-2 d-none d-md-block"
              onClick={() => setEditModal(false)}
            >
              انصراف
            </Button>
            <Button
              radius
              onClick={handelClick}
              className="btn btn-primary d-block px-5"
              loading={isLoading}
            >
              تایید و ذخیره
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPassenger;
