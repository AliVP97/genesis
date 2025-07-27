import React from 'react';
import CustomSelect from 'components/select';
import { FieldValues, useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ArrowDownIcon } from 'assets/icons';

export interface IOption {
  label: string;
  value: string;
}

interface ISelectOutletProps extends React.HTMLProps<HTMLSelectElement> {
  label: string;
  errors?: string | undefined;
  name: string;
  options: Array<IOption>;
  selectAge: (e: string) => void;
}

const SelectOutlet = ({ label, errors, selectAge, value }: ISelectOutletProps) => {
  const { control, handleSubmit } = useForm({
    mode: 'all',
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    selectAge(data.childAge);
  };
  return (
    <form onChange={handleSubmit(onSubmit)} id="hookForm" className="row">
      <Controller
        name="childAge"
        control={control}
        render={({ field }) => (
          <CustomSelect
            field={{ ...field, value: typeof value === 'string' ? value : '' }}
            isError={!!errors}
            errorText={'سن کودک الزامی است.'}
            label={label}
            suffix={<ArrowDownIcon />}
            hotelClassName
          />
        )}
      />
    </form>
  );
};

export default SelectOutlet;
