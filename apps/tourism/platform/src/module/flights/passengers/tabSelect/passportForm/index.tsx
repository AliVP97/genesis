import styles from 'module/flights/passengers/form/passengerForm.module.scss';
import {
  useForm,
  SubmitHandler,
  Controller,
  FieldValues,
  Path,
  ControllerProps,
  Control,
} from 'react-hook-form';
import Input from 'components/input';
import CustomSelect from 'components/select';
import { ArrowDownIcon, InfoIcon } from 'assets/icons';
import Index from 'components/selectDate';
import { validations } from 'module/flights/passengers/form/validations';
import { ComponentProps, PassportFormProps } from '../interface';
import { convertDate } from '../helper';
import { useEffect } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
import { ISelectedCountry } from 'containers/passengers/utilities/types';

interface InputFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  rules?: ControllerProps['rules'];
  control: Control<TFieldValues>;
  label: string;
  errorText?: string;
  [key: string]: unknown;
}

const PassportForm = ({
  handleFormSubmit,
  editData,
  closeModal,
  isAdd,
  containerSize,
  footerDescription,
  isSuccess,
}: ComponentProps) => {
  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<PassportFormProps>({
    defaultValues: {
      englishName: editData?.englishName,
      englishFamily: editData?.englishFamily,
      gender: editData?.gender,
      passportId: editData?.passportId,
      ExpireDay: '',
      ExpireMonth: '',
      ExpireYear: '',
      BirthDay: '',
      BirthMonth: '',
      BirthYear: '',
      nationalId: editData?.nationalId,
    },
  });
  const { isMobile } = useDeviceDetect();
  useEffect(() => {
    if (editData) {
      const dataObj = Object.keys(editData);
      dataObj.forEach((item) => {
        if (item === 'birthday') {
          convertDate(editData[item] as string, { key: 'birthday', jalali: false }, setValue);
        }
        if (item === 'passportExpireDate') {
          convertDate(editData[item] as string, { key: 'expireday', jalali: false }, setValue);
        }
      });
    }
  }, []);

  const resetInput = (name: string) => {
    clearErrors(name as keyof PassportFormProps);
    resetField(name as keyof PassportFormProps);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  const passengerButtonLabel = editData ? 'ویرایش مسافر' : 'افزودن مسافر';
  const containerClass = containerSize === 'md' ? styles['containerSizeMd__footer'] : '';

  const InputFormField = <TFieldValues extends FieldValues>({
    name,
    rules,
    control,
    label,
    errorText,
    ...rest
  }: InputFormFieldProps<TFieldValues>) => (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {
        return (
          <Input
            field={field}
            clearInput={resetInput}
            label={label}
            isError={!!errorText}
            errorText={errorText}
            {...rest}
          />
        );
      }}
    />
  );

  let footerContent;
  if (!isAdd) {
    footerContent = (
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
        <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
          <span>تایید و ذخیره</span>
        </button>
      </div>
    );
  } else {
    footerContent = (
      <div className={`ltr ${containerClass}`}>
        {footerDescription && (
          <div className={styles['description']}>
            <InfoIcon className={styles['icon']} />
            <p>{footerDescription}</p>
          </div>
        )}
        <button
          type="submit"
          className={cn(styles['passengerForm__add-submit'], 'bg-color-white text-3 color-primary')}
        >
          <span>تایید و ذخیره</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <form onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<PassportFormProps>)}>
          <InputFormField
            name="englishName"
            rules={validations.LatinFirstName}
            control={control}
            label="نام لاتین"
            errorText={errors.englishName?.message}
          />
          <InputFormField
            name="englishFamily"
            rules={validations.LatinLastName}
            control={control}
            label="نام خانوادگی لاتین"
            errorText={errors.englishFamily?.message}
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
          <Index
            control={control}
            names={['BirthDay', 'BirthMonth', 'BirthYear']}
            label="تاریخ تولد"
            selectedMonth={watch('BirthMonth')}
            jalali={false}
            hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
          />
          <InputFormField
            name="passportId"
            control={control}
            rules={validations.PassportNumber}
            label="شماره پاسپورت"
            errorText={errors.passportId?.message}
          />
          <Index
            control={control}
            names={['ExpireDay', 'ExpireMonth', 'ExpireYear']}
            label="تاریخ انقضای پاسپورت"
            selectedMonth={watch('ExpireMonth')}
            jalali={false}
            hasErrors={!!errors.ExpireDay || !!errors.ExpireMonth || !!errors.ExpireYear}
          />
          {watch('countryId') &&
            (getValues('countryId') as ISelectedCountry).countryAlpha2 == 'IR' && (
              <InputFormField
                name="nationalId"
                control={control}
                rules={validations.NationalCode}
                label="کدملی"
                errorText={errors.nationalId?.message}
                className="mb-4"
              />
            )}

          <div className={styles['passengerForm__submit']}>
            <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
              {passengerButtonLabel}
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
              <InputFormField
                name="englishName"
                rules={validations.LatinFirstName}
                control={control}
                label="نام لاتین"
                errorText={errors.englishName?.message}
                className="ms-3 mb-4"
              />
            </div>
            <div className="col-3">
              <InputFormField
                name="englishFamily"
                rules={validations.LatinLastName}
                control={control}
                label="نام خانوادگی لاتین"
                errorText={errors.englishFamily?.message}
                className="ms-3 mb-4"
              />
            </div>
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
            <div className="col-3">
              {watch('countryId') &&
                (getValues('countryId') as ISelectedCountry).countryAlpha2 == 'IR' && (
                  <InputFormField
                    name="nationalId"
                    control={control}
                    rules={validations.NationalCode}
                    label="کدملی"
                    errorText={errors.nationalId?.message}
                    className="mb-4"
                  />
                )}
            </div>
          </div>
          {footerContent}
        </form>
      )}
    </>
  );
};

export default PassportForm;
