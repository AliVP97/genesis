import { FC } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';

import { Menu } from '../Option';
import { AsyncSelect } from 'components/AsyncSelect';

type TOptionalServiceSelect = {
  name: string;
  control: Control<FieldValues>;
  options?: {
    label: string;
    value: string;
    price: string;
  }[];
};

export const FreeOptionalServiceSelect: FC<TOptionalServiceSelect> = ({
  name,
  control,
  options,
  ...props
}) => {
  const {
    field: { onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div>
      <AsyncSelect
        placeholder="خدمات رایگان"
        // TODO: use regular select instead of AsyncSelect to avoid this
        loadOptions={async () => Promise.resolve(options)}
        closeMenuOnSelect={false}
        isMulti
        onChange={(item) => {
          if (item && 'value' in item) {
            //@ts-ignore
            onChange(item.value);
          } else if (Array.isArray(item)) {
            onChange(item.map(({ value }) => value));
          }
        }}
        onBlur={onBlur}
        // @ts-expect-error
        components={{ Menu }}
        {...props}
      />
      {error && (
        <span className="color-red pe-3 pt-1 text-2 text-weight-500 d-block text-end">
          {error.message}
        </span>
      )}
    </div>
  );
};
