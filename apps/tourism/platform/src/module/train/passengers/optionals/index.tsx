import { FC } from 'react';

import Router from 'next/router';
import cn from 'classnames';
import { useForm } from 'react-hook-form';

import Button from 'components/button';
import Modal from 'components/modal';
import { PassengerPayload } from 'services/general/passenger/interface';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { BackArrowIcon, InfoIcon } from 'assets/icons';
import { Catering } from 'assets/images';
import { useOptionals, TUseOptionalsProps } from './useOptionals';
import { FreeOptionalServiceSelect, OptionalServiceSelect } from './components';

import styles from './optionals.module.scss';
import passengerstyles from './../list/passengerList.module.scss';

type Props = {
  visible: boolean;
  onClose: () => void;
  passengers: PassengerPayload['body'][];
  isLoading: boolean;
  shouldRenderOptions?: boolean[];
  shouldRenderFreeOptions?: boolean[];
} & TUseOptionalsProps;

const PassengerOptionals: FC<Props> = ({
  visible,
  onClose,
  passengers,
  isLoading,
  shouldRenderOptions = [false],
  shouldRenderFreeOptions = [false],
  ...props
}) => {
  const { isMobile } = useDeviceDetect();
  const {
    handleDesktopPassengers,
    searchButtonClicked,
    routeChangeStarted,
    optionalOptionList,
    freeOptionalOptionList,
    trainIds,
  } = useOptionals({
    shouldRenderOptions,
    shouldRenderFreeOptions,
    ...props,
  });

  const { register, control, handleSubmit } = useForm();

  return isMobile ? (
    <Modal visible={visible} onClose={onClose}>
      <form className={styles.optionals} onSubmit={handleSubmit(handleDesktopPassengers)}>
        <div className={styles.optionals__header}>
          <div className="flex-grow-1" />
          <div className="text-3 text-weight-500 text-center">
            <span>خدمات و پذیرایی</span>
          </div>
          <div className={cn(styles['optionals__header--icon'])} dir="rtl">
            <BackArrowIcon onClick={onClose} />
          </div>
        </div>
        <div className={styles.optionals__services}>
          {trainIds?.map(
            (trainId, leg) =>
              (shouldRenderOptions[leg] || shouldRenderFreeOptions[leg]) && (
                <div key={leg} className={cn(styles.card, 'mb-3')}>
                  <div className="bg-color-blue-grey py-2" dir="rtl">
                    <span className="color-grey-1 text-weight-500 me-2">
                      خدمات قطار {leg === 0 ? 'رفت' : 'برگشت'}
                    </span>
                  </div>
                  <div className={cn(styles.card__items, 'p-2')}>
                    <input
                      type="hidden"
                      defaultValue={trainId}
                      {...register(`legs.${leg}.trainId`)}
                    />
                    {passengers.map((item, index) => (
                      <div key={item.id}>
                        <div className={styles.card__items__passenger}>
                          {item?.persianName
                            ? `${item?.persianName} ${item?.persianFamily}
                      `
                            : `${item?.englishName} ${item?.englishFamily}`}
                        </div>
                        <input
                          type="hidden"
                          defaultValue={item.id}
                          {...register(`legs.${leg}.selectedOptionalServices.${index}.passengerId`)}
                        />
                        {shouldRenderOptions[leg] && (
                          <OptionalServiceSelect
                            name={`legs.${leg}.selectedOptionalServices.${index}.optionalServiceId`}
                            control={control}
                            options={optionalOptionList[leg]}
                          />
                        )}
                        {shouldRenderFreeOptions[leg] && (
                          <FreeOptionalServiceSelect
                            name={`legs.${leg}.selectedOptionalServices.${index}.freeOptionalServiceId`}
                            control={control}
                            options={freeOptionalOptionList[leg]}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
        <div className={styles.optionals__action}>
          <Button
            className="btn btn-primary d-block w-100"
            btnType="submit"
            loading={isLoading || searchButtonClicked || routeChangeStarted}
            radius
          >
            تایید و ادامه
          </Button>
        </div>
      </form>
    </Modal>
  ) : (
    <form onSubmit={handleSubmit(handleDesktopPassengers)}>
      {trainIds?.map(
        (trainId, leg) =>
          (shouldRenderOptions[leg] || shouldRenderFreeOptions[leg]) && (
            <div
              key={leg}
              className={cn(
                passengerstyles['optional-services'],
                'w-100 d-flex flex-column bg-color-white mb-3',
              )}
            >
              <div className="d-flex flex-row justify-content-between align-items-center px-3 py-2 border-bottom border-blue-grey">
                <div className="d-flex flex-row ">
                  <Catering />
                  <div className="me-2">
                    <span>خدمات قطار {leg === 0 ? 'رفت' : 'برگشت'}</span>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column p-4">
                <span className="text-3">لطفا نوع خدمات را برای مسافران زیر را مشخص نمایید.</span>
                <div className={styles['optional-services']}>
                  <input
                    type="hidden"
                    defaultValue={trainId}
                    {...register(`legs.${leg}.trainId`)}
                  />
                  {passengers.map((item, index) => (
                    <div key={item.id} className={styles['optional-services__option-container']}>
                      <div className={styles['option-container__name']}>
                        {item?.persianName
                          ? `${item?.persianName} ${item?.persianFamily}
                      `
                          : `${item?.englishName} ${item?.englishFamily}`}
                      </div>
                      <input
                        type="hidden"
                        defaultValue={item.id}
                        {...register(`legs.${leg}.selectedOptionalServices.${index}.passengerId`)}
                      />
                      {shouldRenderOptions[leg] && (
                        <OptionalServiceSelect
                          name={`legs.${leg}.selectedOptionalServices.${index}.optionalServiceId`}
                          control={control}
                          options={optionalOptionList[leg]}
                        />
                      )}
                      {shouldRenderFreeOptions[leg] && (
                        <FreeOptionalServiceSelect
                          name={`legs.${leg}.selectedOptionalServices.${index}.freeOptionalServiceId`}
                          control={control}
                          options={freeOptionalOptionList[leg]}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ),
      )}
      <div
        className={cn(
          styles.footer,
          'd-flex flex-row justify-content-between bg-color-white p-4 align-items-center',
        )}
      >
        <div className="col-6">
          <InfoIcon className={styles.footer__icon} />
          <span className="text-3 me-2">
            با تایید اطلاعات وارد شده، مسافر جدید به لیست مسافران افزوده خواهد شد.
          </span>
        </div>
        <div className="col-6 ltr">
          <Button
            className={cn(
              styles.footer__btn,
              'btn btn-primary color-white text-3 py-2 px-4 border-0 me-3',
            )}
            btnType={'submit'}
            loading={isLoading || searchButtonClicked || routeChangeStarted}
          >
            <span>تایید و ادامه</span>
          </Button>
          <Button
            className={cn(styles.footer__btn, 'bg-color-white color-grey-1 text-3 py-2 px-4')}
            onClick={() => Router.back()}
          >
            <span>بازگشت</span>
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PassengerOptionals;
