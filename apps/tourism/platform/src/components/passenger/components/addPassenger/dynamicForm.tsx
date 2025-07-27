import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateSchema } from './generateSchema';
import styles from './dynamicForm.module.scss';
import { z } from 'zod';

import DynamicInput from './DynamicInput';
import Button from 'components/button';
import { FormData } from 'components/passenger/components/addPassenger/addPassenger';
import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';

type DynamicFormProps = {
  fields: FormData;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  setNationality: Dispatch<SetStateAction<undefined | string>>;
  setFormMethods?: Dispatch<
    UseFormReturn<
      {
        [x: string]: any;
      },
      object
    >
  >;
};

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  isLoading,
  setNationality,
  setFormMethods,
}) => {
  const schema = generateSchema([...fields?.mandatory, ...fields?.optional]);
  const [expanded, setExpanded] = useState(false);
  type formSchema = z.infer<typeof schema>;
  const methods = useForm<formSchema>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });
  // let buttonDisabled = false;
  // if (
  //   methods.getValues('nationality') === 'IRN' &&
  //   (!methods.getValues('birthday') || !methods.getValues('nationalId'))
  // ) {
  //   buttonDisabled = true;
  // } else {
  //   buttonDisabled = false;
  // }

  useEffect(() => {
    setFormMethods && setFormMethods(methods);
  }, [methods, setFormMethods]);
  const nationality = methods.watch('nationality');
  useEffect(() => {
    setNationality(nationality);
  }, [nationality]);
  const { setEditModal, setAddModal } = useContext(MoreButtonContext);

  useEffect(() => {
    if (fields) {
      fields.mandatory.forEach((item) => {
        const value = methods.getValues(item.id as string);

        if (value) {
          return;
        }

        if (item.value && item.id) {
          if (item.id === 'birthday') {
            let val;
            if (item.calendarType === 'CALENDAR_TYPE_Hijri') {
              val = item.valueHijri?.replace(/\//g, '-');
            } else {
              val = item.value?.replace(/\//g, '-');
            }
            methods.setValue(item.id, val);
          } else {
            methods.setValue(item.id, item.value);
          }
        }
      });
      fields.optional.forEach((item) => {
        if (item.value && item.id) {
          methods.setValue(item.id, item.value);
        }
      });
    }
  }, [fields]);
  useEffect(() => {
    if (!methods.getValues('nationality')) {
      methods.setValue('nationality', 'IRN');
    }
  }, []);
  return (
    <FormProvider {...methods}>
      <div className={styles['container']}>
        <p dir="rtl"> اطلاعات مورد نیاز</p>
        <div className={styles['container__dynamic-input']}>
          {fields?.mandatory.map((field) => {
            return (
              <div key={field.id} style={{ height: '80px' }}>
                <DynamicInput
                  calendarType={field.calendarType}
                  key={field.id}
                  id={field.id}
                  type={field.fieldType}
                  label={field.title}
                  options={field.options}
                  isReadOnly={field.isReadonly}
                />
              </div>
            );
          })}
        </div>
        {fields?.optional?.length > 0 ? (
          <div
            onClick={() => {
              setExpanded((item) => !item);
            }}
            style={{ cursor: 'pointer' }}
            dir="rtl"
            className="d-flex"
          >
            <p dir="rtl"> اطلاعات اختیاری</p>
            <div> {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}</div>
          </div>
        ) : null}

        {expanded && (
          <div className={styles['container__dynamic-input']}>
            {fields?.optional.map((field) => {
              return (
                <div key={field.id} style={{ height: '80px' }}>
                  <DynamicInput
                    key={field.id}
                    id={field.id}
                    type={field.fieldType}
                    label={field.title}
                    options={field.options}
                    isReadOnly={field.isReadonly}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className={styles['container__btns']}>
          <Button
            // disabled={buttonDisabled}
            onClick={methods.handleSubmit(onSubmit)}
            btnType="submit"
            className={styles['container__btns--confirm']}
            loading={isLoading}
          >
            تایید و ذخیره
          </Button>
          <Button
            onClick={() => {
              if (setAddModal && setEditModal) {
                setEditModal(false);
                setAddModal(false);
              }
            }}
            btnType="submit"
            className={styles['container__btns--exit']}
            loading={isLoading}
          >
            انصراف
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default DynamicForm;
