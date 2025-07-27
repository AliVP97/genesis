import AddPassengerForm from 'containers/passengers/form';
import { dynamicForms, nationalCodeDynamicForms } from 'module/flights/passengers/utilities/data';

import React from 'react';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';

type TEmptyAddFormProps = {
  index: number;
  onSubmit: (data: Record<string, string | number | undefined>) => void;
  isLoading: boolean;
};

const EmptyAddForm = React.forwardRef<HTMLFormElement, TEmptyAddFormProps>(
  ({ index, onSubmit, isLoading }, ref) => {
    const isPassport = useIsNajafBaghdad();

    return (
      <>
        {/* <div>
          <div className="d-flex flex-row px-4">
            <RadioElement
              className="text-3 ms-3"
              checked={type === Select.WithNationalCode}
              value={Select.WithNationalCode}
              label={'خرید با کدملی'}
              onChange={(value: Select) => setType(value)}
            />
            <RadioElement
              className="text-3"
              checked={type === Select.WithPassport}
              value={Select.WithPassport}
              label={'خرید با پاسپورت'}
              onChange={(value: Select) => setType(value)}
            />
          </div>
        </div> */}
        <AddPassengerForm
          index={index}
          forms={isPassport ? dynamicForms : nationalCodeDynamicForms}
          onSubmit={onSubmit}
          ref={ref}
          showSubmit={false}
          loading={isLoading}
        />
      </>
    );
  },
);

EmptyAddForm.displayName = 'AddEmptyForm';

export default EmptyAddForm;
