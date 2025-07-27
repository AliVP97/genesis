import EditPassengerForm from 'containers/passengers/edit';
import UseEditPassenger from 'module/flights/passengers/hooks/useUpdatePassenger';
import { PassengerV2EditPayload, TPassengerV2 } from 'services/general/passenger/interface';
import styles from './edit.module.scss';
import Header from '../mobileView/header';
import { useEffect, useRef } from 'react';
import { Edit } from 'assets/icons';
import Button from 'components/button';
import Divider from 'components/divider';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';
import { DomesticFlightEditSchema } from 'module/flights/passengers/utilities/editSchema';
import { normalizeEditPassengerPayload } from 'module/flights/travels/components/passengers/list/edit/utils/normalizeEditPassengerPayload';

type TEditPassengerProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
  setEditModal: (e: boolean) => void;
};

const EditPassenger = ({ passenger, getPassengers, setEditModal }: TEditPassengerProps) => {
  const { editPassenger, isLoading, isSuccess } = UseEditPassenger(getPassengers);

  const formRef = useRef<HTMLFormElement>(null);
  const isNajafAndBaghdad = useIsNajafBaghdad();
  const onSubmit = (data: Record<string, string | number>) => {
    const payload: PassengerV2EditPayload = {
      id: passenger.id || '',
      body: addDomesticFlightPassengerMapper(data, !!isNajafAndBaghdad),
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
        <div className="p-4 pt-4 pb-0">
          {isNajafAndBaghdad !== undefined && (
            <EditPassengerForm
              showSubmit={false}
              forms={DomesticFlightEditSchema(
                passenger,
                isNajafAndBaghdad ? 'passport' : 'nationalCode',
              )}
              ref={formRef}
              onSubmit={onSubmit}
              loading={isLoading}
              btnValue="ویرایش مسافر"
            />
          )}
          <Divider type="horizontal" className="d-none d-md-block" />
          <div className="d-flex mt-3 justify-content-end mb-4 mb-md-0">
            <Button
              radius
              className="btn border bg-color-white color-black  d-block px-5 ms-2"
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
