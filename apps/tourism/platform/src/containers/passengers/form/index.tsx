import Button from 'components/button';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, Control } from 'react-hook-form';

import InputGenerator from '../formGenerator';
import UseGetCountry from '../hooks/useGetCountry';
import { FromSchema } from '../utilities/types';

type TAddPassengerFormProps = {
  forms: Array<Array<FromSchema>>;
  index?: number;
  showSubmit?: boolean;
  isSubmitSuccessful?: boolean;
  onSubmit: (data: Record<string, string | number | undefined>) => void;
  btnValue?: string;
  loading: boolean;
  onChange?: (e: {
    type: 'field' | undefined;
    data: Record<string, string | number | object>;
  }) => void; // type of "e" can be updated to support more types if necessary.
  propControl?: Control;
  cachePassengers?: boolean;
  hotelAddLeader?: boolean;
};

const AddPassengerForm = React.forwardRef<HTMLFormElement, TAddPassengerFormProps>(
  (
    {
      forms,
      index,
      showSubmit = true,
      onSubmit,
      isSubmitSuccessful,
      btnValue,
      loading,
      onChange,
      propControl,
      cachePassengers,
      hotelAddLeader = false,
    },
    ref,
  ) => {
    const {
      handleSubmit,
      resetField,
      clearErrors,
      control,
      watch,
      setValue,
      reset,
      getValues,
      formState: { errors },
      register,
      trigger,
    } = useForm({ mode: 'all' });
    const checkCache = useRef(true);
    if (checkCache.current && cachePassengers) {
      const passengers = localStorage.getItem('hotelPassengers');
      if (passengers) {
        const items = JSON.parse(passengers);
        const formValue = items[index as number];
        if (formValue) {
          for (const key in formValue) {
            setValue(key, formValue[key]);
          }
        }
      }

      checkCache.current = false;
    }
    useEffect(() => {
      if (cachePassengers) {
        const passengers = localStorage.getItem('hotelPassengers');
        let items;
        if (passengers) {
          items = JSON.parse(passengers);
        } else {
          items = [];
        }
        items[index as number] = watch();
        localStorage.setItem('hotelPassengers', JSON.stringify(items));
      }
    }, [watch()]);

    const [showNationalCode, setShowNationalCode] = useState<boolean>(false);

    const resetInput = (name: string, value?: FromSchema['defaultValue']) => {
      clearErrors(name);
      resetField(name);
      setValue(name, value || '');
    };

    const resetInputs = (forms: TAddPassengerFormProps['forms']) => {
      forms.forEach((form) => {
        form.forEach((field) => {
          field.type !== 'checkbox' && resetInput(field.name.toString(), field.defaultValue); // reset to avoid 'autoComplete' fields pop up.
        });
      });
    };

    useEffect(() => {
      !hotelAddLeader && resetInputs(forms);
    }, [forms]);

    const errorMessage = (name: string | string[]): boolean => {
      if (Array.isArray(name)) {
        return name.some((_, index) => errors.hasOwnProperty(name[index]));
      }
      return Boolean(errors[name]);
    };

    const { countries } = UseGetCountry(
      forms.some((x) => x.some((y) => y.type === 'countrySelector')),
    );

    useEffect(() => {
      if (isSubmitSuccessful && !cachePassengers) {
        reset();
        forms.flat().forEach((item) => setValue(item?.name.toString(), ''));
      }
    }, [isSubmitSuccessful]);

    useEffect(() => {
      getValues('passportCountry')?.countryAlpha2 == 'IR'
        ? setShowNationalCode(true)
        : setShowNationalCode(false);
    }, [watch('passportCountry')]);

    useEffect(() => {
      getValues('passportCountry')?.value && trigger('passportId');
    }, [showNationalCode]);

    // DO NOT DELETE THIS COMMENT:
    /* useEffect(() => {
      const subscription = watch((value, {name , type}) => {
        onChange?.({
          type: 'field',
          data: {name: name, value: value[name || '']},
        });
      });
      return () => subscription.unsubscribe();
    }, [watch]); */

    const foreingnerField = useWatch({
      control,
      name: 'foreingner',
    });
    useEffect(() => {
      onChange?.({
        type: 'field',
        data: { name: 'foreingner', value: foreingnerField },
      });
    }, [foreingnerField]);

    const earlyEntryField = useWatch({
      control,
      name: 'earlyEntry',
    });
    useEffect(() => {
      onChange?.({
        type: 'field',
        data: { name: 'earlyEntry', value: earlyEntryField },
      });
    }, [earlyEntryField]);
    const lateExitField = useWatch({
      control,
      name: 'lateExit',
    });

    const extraBedField = useWatch({
      control,
      name: 'extraBed',
    });
    useEffect(() => {
      onChange?.({
        type: 'field',
        data: { name: 'lateExit', value: lateExitField },
      });
    }, [lateExitField]);
    useEffect(() => {
      onChange?.({
        type: 'field',
        data: { name: 'extraBed', value: extraBedField },
      });
    }, [extraBedField]);
    return (
      <>
        <form ref={ref} id={'hook-form-' + index} onSubmit={handleSubmit(onSubmit)}>
          <div className="row rtl">
            {forms?.map((form) => {
              return (
                <>
                  {form.map((item, index) => {
                    if (item?.name != 'nationalCode' && (item.visible || showNationalCode)) {
                      return (
                        <div
                          key={index.toString() + item.name + 'form'}
                          className="col-12 col-sm-6 col-md-3"
                          data-name={item.name}
                        >
                          <InputGenerator
                            disabled={item.disabled}
                            rules={item.rules} // this prop is sarekari
                            hotelAddLeader={hotelAddLeader}
                            control={propControl || control}
                            isError={errorMessage(item.name)}
                            error={errors[item.name as string]?.message as string}
                            resetInput={resetInput}
                            watch={watch}
                            setValue={setValue}
                            countries={countries?.countries || []}
                            onChange={(e) => {
                              onChange?.({ type: undefined, data: e });
                            }}
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
                  })}
                </>
              );
            })}
          </div>
          {showSubmit && (
            <Button
              radius
              btnType="submit"
              className="btn btn-primary d-block px-5 w-100"
              loading={loading}
            >
              {btnValue}
            </Button>
          )}
        </form>
      </>
    );
  },
);

AddPassengerForm.displayName = 'AddPassengerForm';

export default AddPassengerForm;
