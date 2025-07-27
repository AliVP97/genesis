import React from 'react';
import { useRouter } from 'next/router';

import AddPassengerForm from 'containers/passengers/form/v2';
import { formsSchema } from 'module/train/passengers/form';

type TEmptyAddFormProps = {
  index: number;
  onSubmit: (data: Record<string, string | number | undefined>) => void;
  isLoading: boolean;
};

const EmptyAddForm = React.forwardRef<HTMLFormElement, TEmptyAddFormProps>(
  ({ index, onSubmit, isLoading }, ref) => {
    const { query } = useRouter();

    return (
      <>
        <AddPassengerForm
          index={index}
          forms={formsSchema(query?.isInternational === 'true')}
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
