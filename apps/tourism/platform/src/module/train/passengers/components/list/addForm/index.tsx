import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import Divider from 'components/divider';
import Spinner from 'components/spinner';
import AddPassengerForm from 'containers/passengers/form/v2';
import { formsSchema, mapForm2Payload } from 'module/train/passengers/form';
import UseAddPassenger from 'module/train/passengers/hooks/useAddPassenger';

import { InfoIcon } from '../../../../../../assets/icons';
import styles from './addForm.module.scss';

type TAddFormProps = {
  getPassengers: () => void;
};

const AddForm = ({ getPassengers }: TAddFormProps) => {
  const { query } = useRouter();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);

  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(mapForm2Payload(data, query?.isInternational === 'true'));
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
              <div className="container mt-4">
                <AddPassengerForm
                  forms={formsSchema(query?.isInternational === 'true')}
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
              <div className="w-100 d-flex justify-content-between">
                <div className="d-flex align-items-center me-3">
                  <InfoIcon className={styles['footer__icon']} />
                  <span className="text-3 me-2">
                    با تایید اطلاعات وارد شده، مسافر جدید به لیست مسافران افزوده خواهد شد.
                  </span>
                </div>
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
