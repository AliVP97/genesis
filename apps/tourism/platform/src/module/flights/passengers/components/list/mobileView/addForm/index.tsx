import Modal from 'components/modal';
import AddPassengerForm from 'containers/passengers/form';
import Header from '../header';
import { useEffect, useRef } from 'react';
import { nationalCodeDynamicForms, dynamicForms } from 'module/flights/passengers/utilities/data';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import Button from 'components/button';
import UseAddPassenger from 'module/flights/passengers/hooks/useAddPassenger';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';
type TAddFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  getPassengers: () => void;
};
const AddForm = ({ setShowForm, showForm, getPassengers }: TAddFormProps) => {
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);
  const formRef = useRef<HTMLFormElement>(null);
  const isPassport = useIsNajafBaghdad();

  const onsubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(addDomesticFlightPassengerMapper(data, !!isPassport));
  };
  useEffect(() => {
    setShowForm(false);
  }, [isSuccess]);

  const handelClick = () => {
    formRef.current?.requestSubmit();
  };
  return (
    <>
      <Modal visible={showForm} onClose={() => setShowForm(false)}>
        <div className="bg-color-white w-100 h-100 position-fixed overflow-auto">
          <Header title="افزودن مسافر جدید" setShow={setShowForm} />
          <div className="p-4 pt-0 mt-4">
            <div className="d-flex flex-row px-4 mb-3">
              {/* <div className={styles['passengerForm__type']}>
                <button
                  className={
                    type === 'nationalCode'
                      ? styles['passengerForm__type--active']
                      : ''
                  }
                  onClick={() => setType('nationalCode')}
                >
                  خرید با کد ملی
                </button>
                <button
                  className={
                    type === 'passport'
                      ? styles['passengerForm__type--active']
                      : ''
                  }
                  onClick={() => setType('passport')}
                >
                  خرید با پاسپورت
                </button>
              </div> */}
            </div>
            <AddPassengerForm
              forms={isPassport ? dynamicForms : nationalCodeDynamicForms}
              onSubmit={onsubmit}
              btnValue={'افزودن مسافر'}
              loading={isLoading}
              showSubmit={false}
              ref={formRef}
            />
          </div>
          <div className="px-3 mb-4">
            <Button
              radius
              className="btn btn-primary me-2 px-5 w-100"
              btnType="button"
              onClick={handelClick}
            >
              افزودن مسافر{' '}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddForm;
