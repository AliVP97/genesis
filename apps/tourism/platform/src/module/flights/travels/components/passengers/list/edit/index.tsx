import EditPassengerForm from 'containers/passengers/edit';
import UseEditPassenger from 'module/flights/passengers/hooks/useUpdatePassenger';
import { PassengerV2EditPayload, TPassengerV2 } from 'services/general/passenger/interface';
import styles from './edit.module.scss';
import Header from '../mobileView/header';
import { useEffect, useRef, useState } from 'react';
import { Edit } from 'assets/icons';
import Button from 'components/button';
import Divider from 'components/divider';

import RadioElement from 'components/radio';
import { Select } from 'module/flights/passengers/list/interface';
import { TypeProps } from 'module/flights/passengers/tabSelect/interface';

import { DomesticFlightEditSchema } from 'module/flights/passengers/utilities/editSchema';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';
import { normalizeEditPassengerPayload } from './utils/normalizeEditPassengerPayload';

type TEditPassengerProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
  setEditModal: (e: boolean) => void;
};

const EditPassenger = ({ passenger, getPassengers, setEditModal }: TEditPassengerProps) => {
  const { editPassenger, isLoading, isSuccess } = UseEditPassenger(getPassengers);
  const service = ServiceDetector();

  const [type, setType] = useState<TypeProps>(
    service.includes('international') ? 'passport' : 'nationalCode',
  );
  const dynamicForms = DomesticFlightEditSchema(passenger, type);
  const formRef = useRef<HTMLFormElement>(null);
  const isPassport = useIsNajafBaghdad();
  const onSubmit = (data: Record<string, string | number>) => {
    const payload: PassengerV2EditPayload = {
      id: passenger.id || '',
      body: addDomesticFlightPassengerMapper(data, !!isPassport),
    };
    editPassenger(normalizeEditPassengerPayload(payload, passenger, type === 'passport'));
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
        <div className="p-4 pt-1 pb-0">
          <div className="d-md-none mb-3">
            <div className={styles['edit-modal__type']}>
              <button
                className={type === 'nationalCode' ? styles['edit-modal__type--active'] : ''}
                onClick={() => setType('nationalCode')}
              >
                خرید با کد ملی
              </button>
              <button
                className={type === 'passport' ? styles['edit-modal__type--active'] : ''}
                onClick={() => setType('passport')}
              >
                خرید با پاسپورت
              </button>
            </div>
          </div>
          <div className="d-none d-md-block">
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
          </div>

          <EditPassengerForm
            showSubmit={false}
            key={type}
            forms={dynamicForms}
            ref={formRef}
            onSubmit={onSubmit}
            loading={isLoading}
            btnValue="ویرایش مسافر"
          />
          <Divider type="horizontal" className="d-none d-md-block" />
          <div className="d-flex mt-3 justify-content-end mb-4 mb-md-0">
            <Button
              radius
              className="btn bg-color-surface color-primary d-block px-5 ms-2"
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
