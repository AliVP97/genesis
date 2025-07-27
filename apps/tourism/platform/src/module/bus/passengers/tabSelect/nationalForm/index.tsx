import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useForm, SubmitHandler, Controller, FieldValues } from 'react-hook-form';

import UseGetCountry from 'containers/passengers/hooks/useGetCountry';
import Input from 'components/input';
import CustomSelect from 'components/select';
import Index from 'components/selectDate';
import ReSelect from 'components/reselect';
import { toLatin } from 'utils/helpers/numbers';
import { detectDevice } from 'utils/helpers/global';
import { ComponentProps, NationalFormProps } from '../interface';
import { ArrowDownIcon, InfoIcon } from 'assets/icons';
import { validations } from '../../form/validations';
import { ISelectedCountry } from 'containers/passengers/utilities/types';
import { TBusOrder } from 'services/bus/order/interface';

import styles from 'module/bus/passengers/form/passengerForm.module.scss';

const NationalForm = ({
  handleFormSubmit,
  editData,
  closeModal,
  isAdd,
  containerSize,
  footerDescription,
  isSuccess,
}: ComponentProps) => {
  const { query } = useRouter();

  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const queryClient = useQueryClient();

  const isInternational = queryClient?.getQueryData<TBusOrder>(['bus-order', query.id])?.busInfo
    ?.isInternational;

  const { countries } = UseGetCountry();

  const IRAN_COUNTRY_OBJ = useMemo(
    () => countries?.countries?.find(({ countryAlpha2 }) => countryAlpha2 === 'IR'),
    [countries],
  );

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
  } = useForm({
    mode: 'all',
    defaultValues: editData || {
      nationalId: '',
      persianName: '',
      persianFamily: '',
      phoneNumber: '',
      gender: '' as unknown as undefined,
    },
  });

  useEffect(() => {
    if (!editData) setValue('nationalId', toLatin(nationalId));
  }, [nationalId]);

  useEffect(() => {
    if (!editData) setValue('phoneNumber', toLatin(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  const resetInput = (name: string) => {
    clearErrors(name as keyof NationalFormProps);
    resetField(name as keyof NationalFormProps, {
      defaultValue: '',
    });
  };

  const getPassportExpireDateDefaultValue = () => {
    if (editData) {
      return editData.passportExpireDateString;
    }

    return undefined;
  };

  return (
    <>
      {detectDevice() === 'mobile' ? (
        <form onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<FieldValues>)}>
          <Controller
            name="persianName"
            rules={validations.FirstName}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="نام"
                field={field}
                isError={!!error}
                errorText={error?.message}
                clearInput={resetInput}
                handleChange={(e) => setValue(field.name, e.target.value)}
              />
            )}
          />
          <Controller
            name="persianFamily"
            rules={validations.LastName}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="نام خانوادگی"
                field={field}
                isError={!!error}
                errorText={error?.message}
                clearInput={resetInput}
                handleChange={(e) => setValue(field.name, e.target.value)}
              />
            )}
          />
          {isInternational && (
            <>
              <Controller
                name="englishName"
                rules={validations.LatinFirstName}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="نام لاتین"
                    field={field}
                    isError={!!error}
                    errorText={error?.message}
                    clearInput={resetInput}
                    handleChange={(e) => setValue(field.name, e.target.value)}
                  />
                )}
              />
              <Controller
                name="englishFamily"
                rules={validations.LatinLastName}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="نام خانوادگی لاتین"
                    field={field}
                    isError={!!error}
                    errorText={error?.message}
                    clearInput={resetInput}
                    handleChange={(e) => setValue(field.name, e.target.value)}
                  />
                )}
              />
            </>
          )}
          <Controller
            name="phoneNumber"
            rules={validations.PhoneNumber}
            control={control}
            render={({ field, fieldState: { error } }) => {
              const phoneNumberTemp = getValues('phoneNumber');
              phoneNumberTemp && setPhoneNumber(phoneNumberTemp);
              return (
                <Input
                  label="شماره موبایل"
                  field={{ ...field, maxLength: 11 }}
                  inputMode={'numeric'}
                  isError={!!error}
                  errorText={error?.message}
                  clearInput={resetInput}
                  handleChange={(e) => setValue(field.name, e.target.value)}
                />
              );
            }}
          />
          <Controller
            name="gender"
            rules={validations.Gender}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomSelect
                label="جنسیت"
                field={field}
                isError={!!error}
                errorText={error?.message}
                suffix={<ArrowDownIcon />}
              />
            )}
          />
          <Controller
            name="nationalId"
            rules={validations.NationalCode}
            control={control}
            render={({ field, fieldState: { error } }) => {
              const nationalIdTemp = getValues('nationalId');
              nationalIdTemp && setNationalId(nationalIdTemp);
              return (
                <Input
                  label="کد ملی"
                  field={{ ...field, maxlength: 10 }}
                  inputMode={'numeric'}
                  isError={!!error}
                  errorText={error?.message}
                  clearInput={resetInput}
                  handleChange={(e) => setValue(field.name, e.target.value)}
                />
              );
            }}
          />
          <Index
            names={['BirthDay', 'BirthMonth', 'BirthYear']}
            label="تاریخ تولد"
            selectedMonth={watch('BirthMonth')}
            hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
            control={control}
          />
          {isInternational && (
            <>
              <Controller
                name="passportId"
                rules={validations.PassportNumber}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="شماره پاسپورت"
                    field={field}
                    isError={!!error}
                    errorText={error?.message}
                    clearInput={resetInput}
                    handleChange={(e) => setValue(field.name, e.target.value)}
                  />
                )}
              />
              <Index
                names={['ExpireDay', 'ExpireMonth', 'ExpireYear']}
                label="تاریخ انقضای پاسپورت"
                selectedMonth={watch('ExpireDay')}
                selectedYear={watch('ExpireMonth')}
                selectedDay={watch('ExpireYear')}
                jalali={false}
                defaultValue={getPassportExpireDateDefaultValue()}
                hasErrors={!!errors.ExpireDay || !!errors.ExpireMonth || !!errors.ExpireYear}
                control={control}
              />
              <div style={{ display: 'none' }}>
                {countries && (
                  <Controller
                    name="countryObject"
                    rules={validations.PassportCountry}
                    control={control}
                    defaultValue={
                      {
                        countryAlpha2:
                          editData?.countryObject?.countryAlpha2 || IRAN_COUNTRY_OBJ?.countryAlpha2,
                        value: editData?.countryObject?.id || IRAN_COUNTRY_OBJ?.id,
                      } as ISelectedCountry
                    }
                    render={({ field, fieldState: { error } }) => (
                      <ReSelect
                        label={'کشور صادر کننده پاسپورت'}
                        options={countries?.countries || []}
                        field={field}
                        isError={!!error}
                        errorText={error?.message}
                        clearInput={resetInput}
                        setValue={(value) => setValue(field.name, value)}
                      />
                    )}
                  />
                )}
              </div>
            </>
          )}
          <div className={styles['passengerForm__submit']}>
            <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
              {editData ? 'ویرایش مسافر' : 'افزودن مسافر'}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<FieldValues>)}
          className="d-flex flex-column"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            }}
          >
            <Controller
              name="persianName"
              rules={validations.FirstName}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="نام"
                  className="ms-3 mb-4"
                  field={field}
                  isError={!!error}
                  errorText={error?.message}
                  clearInput={resetInput}
                  handleChange={(e) => setValue(field.name, e.target.value)}
                />
              )}
            />
            <Controller
              rules={validations.LastName}
              control={control}
              name="persianFamily"
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="نام خانوادگی"
                  className="ms-3 mb-4"
                  field={field}
                  isError={!!error}
                  errorText={error?.message}
                  clearInput={resetInput}
                  handleChange={(e) => setValue(field.name, e.target.value)}
                />
              )}
            />
            {isInternational && (
              <>
                <Controller
                  name="englishName"
                  rules={validations.LatinFirstName}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      label="نام لاتین"
                      className="ms-3 mb-4"
                      field={field}
                      isError={!!error}
                      errorText={error?.message}
                      clearInput={resetInput}
                      handleChange={(e) => setValue(field.name, e.target.value)}
                    />
                  )}
                />
                <Controller
                  name="englishFamily"
                  rules={validations.LatinLastName}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      label="نام خانوادگی لاتین"
                      className="ms-3 mb-4"
                      field={field}
                      isError={!!error}
                      errorText={error?.message}
                      clearInput={resetInput}
                      handleChange={(e) => setValue(field.name, e.target.value)}
                    />
                  )}
                />
              </>
            )}
            <Controller
              name="phoneNumber"
              rules={validations.PhoneNumber}
              control={control}
              render={({ field, fieldState: { error } }) => {
                const phoneNumberTemp = getValues('phoneNumber');
                phoneNumberTemp && setPhoneNumber(phoneNumberTemp);
                return (
                  <Input
                    label="شماره موبایل"
                    className="ms-3 mb-4"
                    inputMode={'numeric'}
                    field={{ ...field, maxLength: 11 }}
                    isError={!!error}
                    errorText={error?.message}
                    clearInput={resetInput}
                    handleChange={(e) => setValue(field.name, e.target.value)}
                  />
                );
              }}
            />
            <Controller
              name="gender"
              rules={validations.Gender}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomSelect
                  label="جنسیت"
                  className="ms-3 mb-4"
                  field={field}
                  isError={!!error}
                  errorText={error?.message}
                  suffix={<ArrowDownIcon />}
                />
              )}
            />
            <Controller
              name="nationalId"
              control={control}
              rules={validations.NationalCode}
              render={({ field, fieldState: { error } }) => {
                const nationalIdTemp = getValues('nationalId');
                nationalIdTemp && setNationalId(nationalIdTemp);
                return (
                  <Input
                    label="کد ملی"
                    type={'text'}
                    className="ms-3 mb-4"
                    inputMode={'numeric'}
                    field={{ ...field, maxLength: 10 }}
                    isError={!!error}
                    errorText={error?.message}
                    clearInput={resetInput}
                    handleChange={(e) => setValue(field.name, e.target.value)}
                  />
                );
              }}
            />
            <div className="ms-3 mb-4">
              <Index
                names={['BirthDay', 'BirthMonth', 'BirthYear']}
                label="تاریخ تولد"
                selectedMonth={watch('BirthMonth')}
                hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
                control={control}
              />
            </div>
            {isInternational && (
              <>
                <Controller
                  name="passportId"
                  rules={validations.PassportNumber}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      label="شماره پاسپورت"
                      className="ms-3 mb-4"
                      field={field}
                      isError={!!error}
                      errorText={error?.message}
                      clearInput={resetInput}
                      handleChange={(e) => setValue(field.name, e.target.value)}
                    />
                  )}
                />
                <div className="ms-3 mb-4">
                  <Index
                    names={['ExpireDay', 'ExpireMonth', 'ExpireYear']}
                    label="تاریخ انقضای پاسپورت"
                    selectedMonth={watch('ExpireMonth')}
                    selectedYear={watch('ExpireYear')}
                    selectedDay={watch('ExpireDay')}
                    defaultValue={getPassportExpireDateDefaultValue()}
                    jalali={false}
                    hasErrors={!!errors.ExpireDay || !!errors.ExpireMonth || !!errors.ExpireYear}
                    control={control}
                  />
                </div>
                <div style={{ display: 'none' }}>
                  {countries && (
                    <Controller
                      name="countryObject"
                      defaultValue={
                        {
                          countryAlpha2:
                            editData?.countryObject?.countryAlpha2 ||
                            IRAN_COUNTRY_OBJ?.countryAlpha2,
                          value: editData?.countryObject?.id || IRAN_COUNTRY_OBJ?.id,
                        } as ISelectedCountry
                      }
                      rules={validations.PassportCountry}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <ReSelect
                          label={'کشور صادر کننده پاسپورت'}
                          options={countries?.countries || []}
                          className="ms-3 mb-4"
                          field={field}
                          isError={!!error}
                          errorText={error?.message}
                          clearInput={resetInput}
                          setValue={(value) => setValue(field.name, value)}
                        />
                      )}
                    />
                  )}
                </div>
              </>
            )}
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
              <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
                <span>تایید و ذخیره</span>
              </button>
            </div>
          ) : (
            <div
              className={`ltr ${
                containerSize === 'md' ? styles['containerSizeMd__footer'] : ''
              } ${styles['footer']}`}
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

export default NationalForm;
