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
import { ComponentProps, NationalFormProps } from '../interface';
import { PassengerPayload } from 'services/general/passenger/interface';
import { convertDate } from '../helper';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { toLatin } from 'utils/helpers/numbers';
import { detectDevice } from 'utils/helpers/global';

export type DateSelectType = ['BirthDay', 'BirthMonth', 'BirthYear'];

interface InputFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  rules?: ControllerProps['rules'];
  control: Control<TFieldValues>;
  label: string;
  errorText?: string;
  [key: string]: unknown;
}

const NationalForm = ({
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
  } = useForm<NationalFormProps>({
    mode: 'all',
    defaultValues: {
      englishName: '',
      englishFamily: '',
      persianName: '',
      persianFamily: '',
      gender: '',
      nationalId: '',
      BirthDay: '',
      BirthMonth: '',
      BirthYear: '',
    },
  });

  useEffect(() => {
    if (editData) {
      const dataObj = Object.keys(editData);
      dataObj.forEach((item) => {
        if (item === 'birthday') {
          convertDate(editData[item] as string, { key: 'birthday', jalali: true }, setValue);
        }
        setValue(item as keyof NationalFormProps, editData[item as keyof PassengerPayload['body']]);
      });
    }
  }, []);

  const [nationalId, setNationalId] = useState('');
  useEffect(() => {
    if (!editData) setValue('nationalId', toLatin(nationalId));
  }, [nationalId]);

  const resetInput = (name: string) => {
    clearErrors(name as keyof NationalFormProps);
    resetField(name as keyof NationalFormProps);
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
    onRender,
    ...rest
  }: InputFormFieldProps<TFieldValues> & { onRender?: () => void }) => (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field }) => {
        if (onRender) {
          onRender();
        }
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
      {detectDevice() === 'mobile' ? (
        <form onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<NationalFormProps>)}>
          <InputFormField
            name="persianName"
            rules={validations.FirstName}
            control={control}
            label="نام"
            errorText={errors.persianName?.message}
          />
          <InputFormField
            name="persianFamily"
            rules={validations.LastName}
            control={control}
            label="نام خانوادگی"
            errorText={errors.persianFamily?.message}
          />

          <InputFormField
            name="englishName"
            rules={validations.LatinFirstName}
            control={control}
            label="نام لاتین"
            errorText={errors.englishName?.message}
            suffixClassName=""
          />

          <InputFormField
            name="englishFamily"
            rules={validations.LatinLastName}
            control={control}
            label="نام خانوادگی لاتین"
            errorText={errors.englishFamily?.message}
          />
          <Index
            control={control}
            names={['BirthDay', 'BirthMonth', 'BirthYear']}
            label="تاریخ تولد"
            selectedMonth={watch('BirthMonth')}
            hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
          />

          <Controller
            name="gender"
            control={control}
            rules={validations.Gender}
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
          <InputFormField
            name="nationalId"
            control={control}
            rules={validations.NationalCode}
            onRender={() => {
              const nationalIdTemp = getValues('nationalId');
              setNationalId(nationalIdTemp);
            }}
            label="کد ملی"
            errorText={errors.nationalId?.message}
            className="ms-3 mb-4"
            type={'text'}
            inputMode={'numeric'}
          />

          <div className={styles['passengerForm__submit']}>
            <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
              {passengerButtonLabel}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<NationalFormProps>)}
          className="d-flex flex-column"
        >
          <div className="d-flex flex-row justify-content-between">
            <div className="col-3">
              <InputFormField
                name="persianName"
                rules={validations.FirstName}
                control={control}
                label="نام"
                errorText={errors.persianName?.message}
                className="ms-3 mb-4"
              />
            </div>
            <div className="col-3">
              <InputFormField
                rules={validations.LastName}
                control={control}
                name="persianFamily"
                label="نام خانوادگی"
                errorText={errors.persianFamily?.message}
                className="ms-3 mb-4"
              />
            </div>
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
              />
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="col-3">
              <Index
                control={control}
                names={['BirthDay', 'BirthMonth', 'BirthYear']}
                label="تاریخ تولد"
                selectedMonth={watch('BirthMonth')}
                hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
              />
            </div>
            <div className="col-3">
              <Controller
                name="gender"
                control={control}
                rules={validations.Gender}
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
            <div className="col-3">
              <InputFormField
                name="nationalId"
                control={control}
                rules={validations.NationalCode}
                onRender={() => {
                  const nationalIdTemp = getValues('nationalId');
                  setNationalId(nationalIdTemp);
                }}
                label="کد ملی"
                errorText={errors.nationalId?.message}
                className="ms-3 mb-4"
                type={'text'}
                inputMode={'numeric'}
              />
            </div>

            <div className="col-3"></div>
          </div>
          {footerContent}
        </form>
      )}
    </>
  );
};

export default NationalForm;
