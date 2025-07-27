import { Dispatch, FC, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import jmoment from 'moment-jalaali';
import { toast } from 'react-toastify';

import { toastOptions } from './LetMeKnow';
import { ArrowDownIcon, BackArrowIcon, CloseIcon, Info } from 'assets/icons';
import Button from 'components/button';
import Modal from 'components/modal';
import CustomSelect from 'components/select';
import { updateFlightAlert } from 'services/domestic/flight';
import { TFlightAlertsResponse } from 'services/domestic/flight/interface';
import styles from './style.module.scss';

type TSubmitModalProps = {
  data?: TFlightAlertsResponse;
  setData: Dispatch<SetStateAction<TFlightAlertsResponse | undefined>>;
  visibleState: [boolean, Dispatch<SetStateAction<boolean>>];
  onSuccess?: () => void;
  onClose?: () => void;
  returning: boolean;
};

const SubmitModal: FC<TSubmitModalProps> = ({
  data,
  setData,
  visibleState,
  onSuccess,
  onClose: onCloseProp,
  returning = false,
}) => {
  const [modalVisible, setModalVisible] = visibleState;
  const [isLoading, setIsLoading] = useState(false);

  const { query } = useRouter();

  const onClose = () => {
    onCloseProp && onCloseProp();
    setModalVisible(false);
  };

  const onSubmit = () => {
    setIsLoading(true);

    let [originIATA, destinationIATA] = (query?.id as string)?.split('-');
    let departureDate = jmoment(query?.departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    if (returning) {
      [destinationIATA, originIATA] = (query?.id as string)?.split('-');
      departureDate = jmoment(query?.returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    }

    departureDate &&
      updateFlightAlert({
        originIATA,
        destinationIATA,
        departureDate,
        activation: true,
        alertInputs: Object.entries(getValues()).map(([formItemID, formItemFieldID]) => ({
          formItemID,
          formItemFieldID,
        })),
      })
        .then((res) => {
          toast('.اطلاع‌رسانی پرواز  فعال شد', toastOptions);

          setData({ ...data, ...res });

          onSuccess && onSuccess();
          setModalVisible(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message, toastOptions);
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  const { getValues, control } = useForm();

  return (
    <Modal className={styles['modal']} visible={modalVisible} setVisible={setModalVisible}>
      <div className={styles['wrapper']}>
        <div className={styles['mobile-header']}>
          <span>خبرم کن</span>
          <BackArrowIcon
            className={classNames('fill-tertiary', styles['back-icon'])}
            onClick={onClose}
          />
        </div>
        <div className={styles['desktop-header']}>
          <div className={styles['title']}>
            <span>اطلاع‌رسانی پرواز</span>
            <CloseIcon onClick={onClose} />
          </div>
          <hr />
        </div>
        <div className={styles['main']}>
          <div className={styles['description']}>
            <div className={styles['icon']}>
              <Info />
            </div>
            <div className={styles['text']}>{data?.formText}</div>
          </div>
          <div className={styles['specs']}>
            <div>
              <span className={styles['label']}>مسیر:</span>
              <span className={styles['value']}>
                {data?.origin} به {data?.destination}
              </span>
            </div>
            <hr />
            <div>
              <span className={styles['label']}>زمان:</span>
              <span className={styles['value']}>{data?.persianTime}</span>
            </div>
          </div>
          <form className={styles['form']}>
            {data?.formItems?.map(({ id, title, formItemType, formItemFields }) => (
              <div key={id}>
                {formItemType === 'FORM_ITEM_DROP_DOWN' && id && (
                  <Controller
                    name={id}
                    defaultValue={formItemFields?.find(({ selected }) => selected)?.['id']}
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        suffix={<ArrowDownIcon />}
                        field={{ ...field, name: 'select' }}
                        label={title || ''}
                        options={formItemFields?.map(({ title: fieldTitle, id: fieldId }) => ({
                          label: fieldTitle || '',
                          value: fieldId || '',
                        }))}
                        isError={false}
                        errorText="خطا"
                      />
                    )}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
        <div className={styles['footer']}>
          <Button className="btn btn-primary" radius onClick={onSubmit} loading={isLoading}>
            تایید
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SubmitModal;
