import Button from 'components/button';
import { TypeProps } from 'module/flights/passengers/tabSelect/interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import InputGenerator from '../formGenerator';
import UseGetCountry from '../hooks/useGetCountry';
import { FromSchema } from '../utilities/types';

type TAddPassengerFormProps = {
  forms: Array<Array<FromSchema>>;
  index?: number;
  showSubmit?: boolean;
  onSubmit: (data: Record<string, string | number>) => void;
  btnValue?: string;
  loading: boolean;
  type?: TypeProps;
};

const EditPassengerForm = React.forwardRef<HTMLFormElement, TAddPassengerFormProps>(
  ({ forms, index, showSubmit = true, onSubmit, btnValue, loading }, ref) => {
    const {
      handleSubmit,
      resetField,
      clearErrors,
      control,
      watch,
      setValue,
      getValues,
      formState: { errors },
      register,
      trigger,
    } = useForm();

    const [showNationalCode, setShowNationalCode] = useState<boolean>(false);
    const resetInput = (name: string) => {
      clearErrors(name);
      resetField(name);
      setValue(name, '');
    };
    const errorMessage = (name: string | string[]): boolean => {
      if (Array.isArray(name)) return name.some((_, index) => errors.hasOwnProperty(name[index]));
      return Boolean(errors[name]);
    };

    const { countries } = UseGetCountry(
      forms.some((x) => x.some((y) => y.type === 'countrySelector')),
    );

    useEffect(() => {
      getValues('passportCountry')?.countryAlpha2 == 'IR'
        ? setShowNationalCode(true)
        : setShowNationalCode(false);
    }, [watch('passportCountry'), countries]);

    useEffect(() => {
      getValues('passportCountry')?.value && trigger('passportId');
    }, [showNationalCode, watch('passportId')?.length > 0]);

    return (
      <>
        {forms.length > 0 && (
          <form ref={ref} id={'hook-form-' + index} onSubmit={handleSubmit(onSubmit)}>
            <div className="row rtl">
              {forms?.map((form) => {
                return form.map((item, index) => {
                  if (item.visible || (showNationalCode && item?.name == 'nationalId')) {
                    return (
                      <div key={index.toString() + 'edit' + item.name} className="col-12 col-md-3">
                        <InputGenerator
                          rules={item.rules}
                          error={errors[item.name as string]?.message as string}
                          control={control}
                          isError={errorMessage(item.name)}
                          resetInput={(e: string) => resetInput(e)}
                          watch={watch}
                          defaultValue={item.defaultValue}
                          setValue={setValue}
                          countries={countries?.countries || []}
                          {...item}
                          className={item.name === 'passportId' ? 'en' : undefined}
                          register={register}
                          validation={
                            item.name === 'passportId' && !showNationalCode
                              ? {
                                  pattern: undefined,
                                }
                              : undefined
                          }
                        />
                      </div>
                    );
                  }
                });
              })}
            </div>
            {showSubmit && (
              <Button radius btnType="submit" className="btn btn-primary d-block" loading={loading}>
                {btnValue}
              </Button>
            )}
          </form>
        )}
      </>
    );
  },
);

EditPassengerForm.displayName = 'EditPassengerForm';

export default EditPassengerForm;
