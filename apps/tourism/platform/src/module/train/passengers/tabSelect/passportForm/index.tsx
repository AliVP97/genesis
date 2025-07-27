import styles from 'module/train/passengers/form/passengerForm.module.scss';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Input from 'components/input';
import CustomSelect from 'components/select';
import { ArrowDownIcon, InfoIcon } from 'assets/icons';
import Index from 'components/selectDate';
import { validations } from 'module/train/passengers/form/validations';

import { ComponentProps, PassportFormProps } from '../interface';
import { PassengerPayload } from 'services/general/passenger/interface';
import { convertDate } from '../helper';
import { useEffect } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
const PassportForm = ({
  handleFormSubmit,
  editData,
  closeModal,
  isAdd,
  containerSize,
  footerDescription,
}: ComponentProps) => {
  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PassportFormProps>({
    defaultValues: {
      englishName: '',
      englishFamily: '',
      gender: '',
      passportId: '',
      ExpireDay: '',
      ExpireMonth: '',
      ExpireYear: '',
      BirthDay: '',
      BirthMonth: '',
      BirthYear: '',
    },
  });
  const { isMobile } = useDeviceDetect();
  useEffect(() => {
    if (editData) {
      const dataObj = Object.keys(editData);
      dataObj.map((item) => {
        if (item === 'birthday') {
          convertDate(editData[item] as string, { key: 'birthday', jalali: false }, setValue);
        }
        if (item === 'passportExpireDate') {
          convertDate(editData[item] as string, { key: 'expireday', jalali: false }, setValue);
        }
        setValue(item as keyof PassportFormProps, editData[item as keyof PassengerPayload['body']]);
      });
    }
  }, []);
  const resetInput = (name: string) => {
    clearErrors(name as keyof PassportFormProps);
    resetField(name as keyof PassportFormProps);
  };

  return (
    <>
      {isMobile ? (
        <form onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<PassportFormProps>)}>
          <Controller
            name="englishName"
            rules={validations.LatinFirstName}
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.englishName}
                label="نام لاتین"
                errorText={errors.englishName?.message}
              />
            )}
          />
          <Controller
            name="englishFamily"
            rules={validations.LatinLastName}
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.englishFamily}
                label="نام خانوادگی لاتین"
                errorText={errors.englishFamily?.message}
              />
            )}
          />{' '}
          <Index
            control={control}
            names={['BirthDay', 'BirthMonth', 'BirthYear']}
            label="تاریخ تولد"
            selectedMonth={watch('BirthMonth')}
            jalali={false}
            hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
          />
          <Controller
            name="gender"
            rules={validations.Gender}
            control={control}
            render={({ field }) => (
              <CustomSelect
                field={field}
                isError={!!errors.gender}
                errorText={errors.gender?.message}
                label="جنسیت"
                suffix={<ArrowDownIcon />}
              />
            )}
          />
          <Controller
            name="passportId"
            control={control}
            rules={validations.PassportNumber}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                label="شماره پاسپورت"
                isError={!!errors.passportId}
                errorText={errors.passportId?.message}
              />
            )}
          />
          {/* <Index
            control={control}
            names={['ExpireDay', 'ExpireMonth', 'ExpireYear']}
            label="تاریخ انقضای پاسپورت"
            selectedMonth={watch('ExpireMonth')}
            jalali={false}
            hasErrors={
              !!errors.ExpireDay || !!errors.ExpireMonth || !!errors.ExpireYear
            }
          /> */}
          <div className={styles['passengerForm__submit']}>
            <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
              {editData ? 'ویرایش مسافر' : 'افزودن مسافر'}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<PassportFormProps>)}
          className="d-flex flex-column"
        >
          <div className="d-flex flex-row justify-content-between">
            <div className="col-3">
              <Controller
                name="englishName"
                rules={validations.LatinFirstName}
                control={control}
                render={({ field }) => (
                  <Input
                    field={field}
                    clearInput={resetInput}
                    isError={!!errors.englishName}
                    label="نام لاتین"
                    errorText={errors.englishName?.message}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>
            <div className="col-3">
              <Controller
                name="englishFamily"
                rules={validations.LatinLastName}
                control={control}
                render={({ field }) => (
                  <Input
                    field={field}
                    clearInput={resetInput}
                    isError={!!errors.englishFamily}
                    label="نام خانوادگی لاتین"
                    errorText={errors.englishFamily?.message}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>{' '}
            <div className="col-3">
              <Index
                control={control}
                names={['BirthDay', 'BirthMonth', 'BirthYear']}
                label="تاریخ تولد"
                jalali={false}
                selectedMonth={watch('BirthMonth')}
                hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
              />
            </div>
            <div className="col-3">
              <Controller
                name="gender"
                rules={validations.Gender}
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    field={field}
                    isError={!!errors.gender}
                    errorText={errors.gender?.message}
                    label="جنسیت"
                    suffix={<ArrowDownIcon />}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="col-3"></div>
            <div className="col-3">
              <Controller
                name="passportId"
                control={control}
                rules={validations.PassportNumber}
                render={({ field }) => (
                  <Input
                    field={field}
                    clearInput={resetInput}
                    label="شماره پاسپورت"
                    isError={!!errors.passportId}
                    errorText={errors.passportId?.message}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>
            <div className="col-3">
              <div className="ms-3 mb-4">
                <Index
                  control={control}
                  names={['ExpireDay', 'ExpireMonth', 'ExpireYear']}
                  label="تاریخ انقضای پاسپورت"
                  selectedMonth={watch('ExpireMonth')}
                  jalali={false}
                  hasErrors={!!errors.ExpireDay || !!errors.ExpireMonth || !!errors.ExpireYear}
                />
              </div>
            </div>
            <div className="col-3"></div>
          </div>
          {!isAdd ? (
            <div
              className={cn(
                styles['passengerForm__submit'],
                'd-flex flex-row border-top pt-3 justify-content-end',
              )}
            >
              <button
                className={cn(styles['passengerForm__submit__refuse'], 'ms-2')}
                onClick={closeModal}
              >
                <span>انصراف</span>
              </button>
              <button className={styles['passengerForm__submit__confirm']} type="submit">
                <span>تایید و ذخیره</span>
              </button>
            </div>
          ) : (
            <div
              className={`ltr ${containerSize === 'md' ? styles['containerSizeMd__footer'] : ''}`}
            >
              {footerDescription && (
                <div className={styles['description']}>
                  <InfoIcon className={styles['icon']} />
                  <p>{footerDescription}</p>
                </div>
              )}
              <button
                type="submit"
                className={cn(
                  styles['passengerForm__add-submit'],
                  'bg-color-white text-3 color-primary',
                )}
              >
                <span>تایید و ذخیره</span>
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default PassportForm;
