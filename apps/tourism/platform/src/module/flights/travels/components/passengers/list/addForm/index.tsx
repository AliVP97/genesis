import AddPassengerForm from 'containers/passengers/form';

import cn from 'classnames';
import { useRef, useState } from 'react';
import styles from './addForm.module.scss';
import Divider from 'components/divider';
import Spinner from 'components/spinner';
import RadioElement from 'components/radio';
import { Select } from 'module/flights/passengers/list/interface';
import { dynamicForms, nationalCodeDynamicForms } from 'module/flights/passengers/utilities/data';
import { TypeProps } from 'module/flights/passengers/tabSelect/interface';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import UseAddPassenger from 'module/flights/passengers/hooks/useAddPassenger';

type TAddFormProps = {
  getPassengers: () => void;
};

const AddForm = ({ getPassengers }: TAddFormProps) => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const hideForm = (): void => {
    setShowAdd(false);
  };
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers, hideForm);

  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<TypeProps>('nationalCode');
  const onSubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(addDomesticFlightPassengerMapper(data, type === 'nationalCode' ? false : true));
  };
  const handelClick = () => {
    formRef.current?.requestSubmit();
  };
  return (
    <>
      <div className={styles['add-btn']}>
        {!showAdd && (
          <div
            className={cn('py-4 d-flex justify-content-center')}
            onClick={() => setShowAdd(true)}
          >
            <button className={styles['add-btn__more']}>افزودن مسافر جدید</button>
          </div>
        )}

        {showAdd && (
          <>
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
              <div className="container mt-4">
                <AddPassengerForm
                  forms={type === 'nationalCode' ? nationalCodeDynamicForms : dynamicForms}
                  key={type}
                  onSubmit={onSubmit}
                  showSubmit={false}
                  ref={formRef}
                  isSubmitSuccessful={isSuccess}
                  btnValue="افزودن مسافر جدید"
                  loading={isLoading}
                />
              </div>
            </div>
            <div className="mt-2">
              <Divider type="horizontal" />
              <div className="w-100 d-flex justify-content-end">
                <button
                  className={cn(styles['add-btn__submit'], 'btn py-3 ms-4 color-primary')}
                  onClick={handelClick}
                >
                  <>{isLoading ? <Spinner /> : <span> تایید و ذخیره</span>}</>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddForm;
