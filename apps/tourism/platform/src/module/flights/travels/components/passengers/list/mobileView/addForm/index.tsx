import Modal from 'components/modal';
import AddPassengerForm from 'containers/passengers/form';

import Header from '../header';

import { useEffect, useState } from 'react';

import { TypeProps } from 'module/flights/passengers/tabSelect/interface';
import styles from './addForm.module.scss';
import { nationalCodeDynamicForms, dynamicForms } from 'module/flights/passengers/utilities/data';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import { ISelectedCountry } from 'containers/passengers/utilities/types';
import UseAddPassenger from 'module/flights/passengers/hooks/useAddPassenger';

type TAddFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  getPassengers: () => void;
};
const AddForm = ({ setShowForm, showForm, getPassengers }: TAddFormProps) => {
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);

  const onsubmit = (data: Record<string, string | number | ISelectedCountry | undefined>) => {
    addAddPassenger(addDomesticFlightPassengerMapper(data, type === 'nationalCode' ? false : true));
  };
  const [type, setType] = useState<TypeProps>('nationalCode');
  useEffect(() => {
    setShowForm(false);
  }, [isSuccess]);

  return (
    <>
      <Modal visible={showForm} onClose={() => setShowForm(false)}>
        <div className="bg-color-white w-100 h-100 position-fixed overflow-auto">
          <Header title="افزودن مسافر جدید" setShow={setShowForm} />
          <div className="p-4 pt-0">
            <div className="d-flex flex-row px-4 mb-3">
              <div className={styles['passengerForm__type']}>
                <button
                  className={type === 'nationalCode' ? styles['passengerForm__type--active'] : ''}
                  onClick={() => setType('nationalCode')}
                >
                  خرید با کد ملی
                </button>
                <button
                  className={type === 'passport' ? styles['passengerForm__type--active'] : ''}
                  onClick={() => setType('passport')}
                >
                  خرید با پاسپورت
                </button>
              </div>
            </div>
            <AddPassengerForm
              forms={type === 'nationalCode' ? nationalCodeDynamicForms : dynamicForms}
              key={type}
              onSubmit={onsubmit}
              btnValue={'افزودن مسافر'}
              loading={isLoading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddForm;
