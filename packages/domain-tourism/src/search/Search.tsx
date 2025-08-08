import { FC, useState } from 'react';

import { SwapVert } from '@mui/icons-material';

import { Button, TextField, ToggleButton, ToggleButtonGroup } from '@780/ui';

import { PassengerCount } from '../passenger-count';

type SearchProps = {
  onSubmit?: (data: unknown) => void;
};

export const Search: FC<SearchProps> = ({ onSubmit }) => {
  const [tripType, setTripType] = useState<'one-way' | 'two-way'>('one-way');

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form
      className="flex flex-col justify-center gap-y-6 p-4 md:flex-row md:gap-4 md:p-20"
      onSubmit={submitHandler}
    >
      <ToggleButtonGroup
        size="small"
        exclusive
        className="mx-auto"
        value={tripType}
        color="primary"
        onChange={(event, newValue) => {
          if (newValue !== null) {
            setTripType(newValue);
          }
        }}
      >
        <ToggleButton className="w-32" value="one-way">
          یک‌طرفه
        </ToggleButton>
        <ToggleButton className="w-32" value="two-way">
          رفت و برگشت
        </ToggleButton>
      </ToggleButtonGroup>
      <div className="relative flex flex-col md:flex-row">
        <div className="absolute end-0 top-9 z-10 origin-center translate-x-5 rounded-full bg-blue-300 p-2 md:start-1/2 md:top-2">
          <SwapVert className="md:rotate-90" />
        </div>
        <TextField
          placeholder="مبدا"
          name="origin"
          slotProps={{
            input: { className: 'rounded-b-none md:rounded-e-none' },
          }}
        />
        <TextField
          placeholder="مقصد"
          name="destination"
          slotProps={{
            input: { className: '-mt-[1px] rounded-t-none md:rounded-s-none' },
          }}
        />
      </div>
      <TextField label="تاریخ رفت" name="departureDate" />
      {tripType === 'two-way' && (
        <TextField label="تاریخ برگشت" name="returnDate" />
      )}
      <PassengerCount />
      <Button
        className="w-full md:w-32"
        size={'large'}
        type="submit"
        variant={'contained'}
      >
        جستجو
      </Button>
    </form>
  );
};
