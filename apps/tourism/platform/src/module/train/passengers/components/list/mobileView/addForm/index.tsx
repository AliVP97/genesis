import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import Modal from 'components/modal';
import AddPassengerForm from 'containers/passengers/form/v2';
import Header from '../header';
import Button from 'components/button';
import { formsSchema, mapForm2Payload } from 'module/train/passengers/form';
import UseAddPassenger from 'module/train/passengers/hooks/useAddPassenger';

type TAddFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  getPassengers: () => void;
};
const AddForm = ({ setShowForm, showForm, getPassengers }: TAddFormProps) => {
  const { query } = useRouter();

  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);

  const formRef = useRef<HTMLFormElement>(null);

  const onsubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(mapForm2Payload(data, query?.isInternational === 'true'));
  };

  const handelClick = () => {
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    setShowForm(false);
  }, [isSuccess]);

  return (
    <>
      <Modal visible={showForm} onClose={() => setShowForm(false)}>
        <div className="bg-color-white w-100 h-100 position-fixed overflow-auto">
          <div className="d-flex flex-column h-100 justify-content-between">
            <Header title="افزودن مسافر جدید" setShow={setShowForm} />
            <div className="p-4 mt-3   flex-grow-1">
              <AddPassengerForm
                forms={formsSchema(query?.isInternational === 'true')}
                onSubmit={onsubmit}
                ref={formRef}
                btnValue={'افزودن مسافر'}
                loading={isLoading}
                showSubmit={false}
              />
            </div>
            <div className="px-3 mb-4">
              <Button
                btnType="submit"
                onClick={handelClick}
                className="btn btn-primary border-0 w-100"
                radius
                loading={isLoading}
              >
                افزودن مسافر
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddForm;
