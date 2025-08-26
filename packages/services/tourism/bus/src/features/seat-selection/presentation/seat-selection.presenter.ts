import { HTMLAttributes } from 'react';

import { Repository } from '../infrastructure/seat-selection.repository';

export type Presenter = Repository & {
  formHandler: HTMLAttributes<HTMLFormElement>;
};

export const presenter = (repository: Repository): Presenter => {
  const formHandler: HTMLAttributes<HTMLFormElement> = {
    onChange: (e) => {
      if (e.target instanceof HTMLInputElement) {
        const value = Number(e.target.value);

        if (e.target.checked) {
          repository.selectSeat(value);
        } else {
          repository.deselectSeat(value);
        }
      }
    },
  };

  return {
    ...repository,
    formHandler,
  };
};
