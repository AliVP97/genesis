import styles from 'module/train/passengers/form/passengerForm.module.scss';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Input from 'components/input';
import CustomSelect from 'components/select';
import { ArrowDownIcon, InfoIcon } from 'assets/icons';
import Index from 'components/selectDate';
import { validations } from 'module/train/passengers/form/validations';
import { ComponentProps, NationalFormProps } from '../interface';
import { PassengerPayload } from 'services/general/passenger/interface';
import { convertDate } from '../helper';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import { toLatin } from 'utils/helpers/numbers';
import { detectDevice } from 'utils/helpers/global';

export type DateSelectType = ['BirthDay', 'BirthMonth', 'BirthYear'];

const NationalForm = ({
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
    getValues,
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
      dataObj.map((item) => {
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

  return (
    <>
      {detectDevice() === 'mobile' ? (
        <form onSubmit={handleSubmit(handleFormSubmit as SubmitHandler<NationalFormProps>)}>
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
                suffixClassName=""
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
          />

          <Controller
            name="persianName"
            rules={validations.FirstName}
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.persianName}
                label="نام"
                errorText={errors.persianName?.message}
              />
            )}
          />
          <Controller
            rules={validations.LastName}
            control={control}
            name="persianFamily"
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                label="نام خانوادگی"
                isError={!!errors.persianFamily}
                errorText={errors.persianFamily?.message}
              />
            )}
          />
          <Index
            control={control}
            names={['BirthDay', 'BirthMonth', 'BirthYear']}
            label="تاریخ تولد"
            selectedMonth={watch('BirthMonth')}
            hasErrors={!!errors.BirthDay || !!errors.BirthMonth || !!errors.BirthYear}
          />
          <Controller
            name="nationalId"
            control={control}
            rules={validations.NationalCode}
            render={({ field }) => {
              const nationalIdTemp = getValues('nationalId');
              setNationalId(nationalIdTemp);
              return (
                <Input
                  field={field}
                  clearInput={resetInput}
                  label="کد ملی"
                  isError={!!errors.nationalId}
                  errorText={errors.nationalId?.message}
                  className="ms-3 mb-4"
                  type={'text'}
                  inputMode={'numeric'}
                />
              );
            }}
          />

          <div className={styles['passengerForm__submit']}>
            <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
              {editData ? 'ویرایش مسافر' : 'افزودن مسافر'}
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
              <Controller
                name="persianName"
                rules={validations.FirstName}
                control={control}
                render={({ field }) => (
                  <Input
                    field={field}
                    clearInput={resetInput}
                    isError={!!errors.persianName}
                    label="نام"
                    errorText={errors.persianName?.message}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>
            <div className="col-3">
              <Controller
                rules={validations.LastName}
                control={control}
                name="persianFamily"
                render={({ field }) => (
                  <Input
                    field={field}
                    clearInput={resetInput}
                    label="نام خانوادگی"
                    isError={!!errors.persianFamily}
                    errorText={errors.persianFamily?.message}
                    className="ms-3 mb-4"
                  />
                )}
              />
            </div>
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
                  />
                )}
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
              <Controller
                name="nationalId"
                control={control}
                rules={validations.NationalCode}
                render={({ field }) => {
                  const nationalIdTemp = getValues('nationalId');
                  setNationalId(nationalIdTemp);
                  return (
                    <Input
                      field={field}
                      clearInput={resetInput}
                      label="کد ملی"
                      isError={!!errors.nationalId}
                      errorText={errors.nationalId?.message}
                      className="ms-3 mb-4"
                      type={'text'}
                      inputMode={'numeric'}
                    />
                  );
                }}
              />
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
              <button className={cn(styles['passengerForm__submit__confirm'])} type="submit">
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

export default NationalForm;
