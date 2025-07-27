import AddPassengerForm from 'containers/passengers/form';

import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './addForm.module.scss';
import Divider from 'components/divider';
import Spinner from 'components/spinner';
import { dynamicForms, nationalCodeDynamicForms } from 'module/flights/passengers/utilities/data';
import { addDomesticFlightPassengerMapper } from 'module/flights/passengers/utilities/helper';
import { AddPassenger } from 'assets/icons';
import UseAddPassenger from 'module/flights/passengers/hooks/useAddPassenger';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';

type TAddFormProps = {
  getPassengers: () => void;
};

const AddForm = ({ getPassengers }: TAddFormProps) => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);

  const formRef = useRef<HTMLFormElement>(null);
  const isPassport = useIsNajafBaghdad();

  const onSubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(addDomesticFlightPassengerMapper(data, !!isPassport));
  };
  const handelClick = () => {
    formRef.current?.requestSubmit();
  };
  useEffect(() => {
    setShowAdd(false);
  }, [isSuccess]);

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
              <div>
                <div className="pt-3 px-4 d-flex justify-content-between">
                  <div>
                    <AddPassenger />
                    <span className="pe-2 color-gray-1">افزودن مسافر جدید</span>
                  </div>
                  <span onClick={() => setShowAdd(false)}>&#x2715;</span>
                </div>
              </div>
              <div className="container mt-4">
                <AddPassengerForm
                  forms={isPassport ? dynamicForms : nationalCodeDynamicForms}
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
