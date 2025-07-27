import Button from 'components/button';
import { TypeProps } from 'module/flights/passengers/tabSelect/interface';
import React, { useEffect, useRef, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';

import InputGenerator from '../../formGenerator';
import UseGetCountry from '../../hooks/useGetCountry';
import { FromSchemaV2, ISelectedCountry } from '../../utilities/types';
import { TFormPassportCountry } from 'module/train/passengers/form';
import dayjs from 'dayjs';

interface BirthDay {
  year: string;
  month: string;
  day: string;
}

function getBirthDay(dateString: string | undefined): BirthDay {
  const [year, month, day] = dateString?.split('-') || [];

  return {
    year,
    month,
    day,
  };
}

type TAddPassengerFormProps = {
  forms: Array<Array<FromSchemaV2>>;
  index?: number;
  showSubmit?: boolean;
  onSubmit: (data: Record<string, string | number | TFormPassportCountry | undefined>) => void;
  btnValue?: string;
  loading: boolean;
  type?: TypeProps;
  defaultValues?: Record<string, string | number | TFormPassportCountry | undefined>;
};

const EditPassengerForm = React.forwardRef<HTMLFormElement, TAddPassengerFormProps>(
  ({ forms, index, showSubmit = true, onSubmit, btnValue, loading, defaultValues }, ref) => {
    const [countryAlpha2, setCountryAlpha2] = useState<string | undefined>(
      (defaultValues?.countryObject as TFormPassportCountry).countryAlpha2,
    );
    const [showNationalCode, setShowNationalCode] = useState<boolean>(false);
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
    } = useForm({ defaultValues });

    const firstTime = useRef(true);
    const prevCountryAlpha2 = useRef<string>();
    const prevBirthDay = useRef<string>();

    useEffect(() => {
      if (firstTime.current) {
        firstTime.current = false;

        const countryAlpha2 = (defaultValues?.countryObject as TFormPassportCountry).countryAlpha2;
        let birthDay: BirthDay;

        if (countryAlpha2 !== 'IR') {
          birthDay = getBirthDay(defaultValues?.birthdayString as string);
        } else {
          birthDay = getBirthDay(defaultValues?.hijriBirthdayString as string);
        }

        setValue('BirthDay', birthDay.day);
        setValue('BirthMonth', birthDay.month);
        setValue('BirthYear', birthDay.year);
        prevCountryAlpha2.current = countryAlpha2;
        return;
      }

      let birthDay: BirthDay;

      if (prevCountryAlpha2.current === 'IR') {
        birthDay = getBirthDay(dayjs(prevBirthDay.current).calendar('jalali').format('YYYY-MM-DD'));
      } else if (countryAlpha2 === 'IR') {
        // convert to gregorian from persian date format
        const d = new Date(prevBirthDay.current as string)
          .toLocaleDateString('fa-IR-u-nu-latn', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '-');
        birthDay = getBirthDay(d);
      } else {
        birthDay = getBirthDay(prevBirthDay.current);
      }

      setValue('BirthDay', birthDay.day);
      setValue('BirthMonth', birthDay.month);
      setValue('BirthYear', birthDay.year);
      prevCountryAlpha2.current = countryAlpha2;
    }, [countryAlpha2]);

    useEffect(() => {
      prevBirthDay.current = `${watch('BirthYear')}-${watch('BirthMonth')}-${watch('BirthDay')}`;
    }, [watch('BirthYear'), watch('BirthMonth'), watch('BirthYear')]);

    const resetInput = (name: string) => {
      clearErrors(name);
      resetField(name);
      setValue(name, '');
    };
    const errorMessage = (name: string | string[]) => {
      if (Array.isArray(name)) return name.some((_, index) => errors.hasOwnProperty(name[index]));
      return errors[name];
    };

    const { countries } = UseGetCountry(
      forms.some((x) => x.some((y) => y.type === 'countrySelector')),
    );

    useEffect(() => {
      const passportCountry = getValues('passportCountry');

      if (typeof passportCountry === 'object') {
        (passportCountry as ISelectedCountry)?.countryAlpha2 == 'IR'
          ? setShowNationalCode(true)
          : setShowNationalCode(false);
      }

      setCountryAlpha2((passportCountry as ISelectedCountry)?.countryAlpha2);
    }, [watch('passportCountry'), countries]);

    useEffect(() => {
      const passportCountry = getValues('passportCountry');

      if (typeof passportCountry === 'object') {
        (passportCountry as ISelectedCountry)?.value && trigger('passportId');
      }
    }, [showNationalCode, (watch('passportId') as string)?.length > 0]);

    const shouldRenderItem = ({ visiblity }: FromSchemaV2) => {
      const mapper: Record<FromSchemaV2['visiblity'], boolean> = {
        all: true,
        domestic: showNationalCode,
        foreign: !showNationalCode,
      };

      return mapper[visiblity] ?? true;
    };

    return (
      <>
        {forms.length > 0 && (
          <form ref={ref} id={'hook-form-' + index} onSubmit={handleSubmit(onSubmit)}>
            <div className="row rtl">
              {forms?.map((form) => {
                return form.map((item, index) => {
                  if (shouldRenderItem(item)) {
                    return (
                      <div
                        key={index.toString() + 'editV2' + item.name}
                        className="col-12 col-md-3"
                      >
                        <InputGenerator
                          rules={item.rules}
                          error={(errors[item.name as string] as FieldError)?.message}
                          control={control}
                          isError={Boolean(errorMessage(item.name))}
                          resetInput={(e: string) => resetInput(e)}
                          watch={watch}
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
