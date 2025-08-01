import { FC } from 'react';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import { Button, Fab, TextField, Typography } from '@780/ui';

import { PassengerCount } from '../passenger-count';

type SearchProps = {
  onSubmit?: (data: unknown) => void;
};

export const Search: FC<SearchProps> = ({ onSubmit }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form className="flex justify-center gap-4 p-20" onSubmit={submitHandler}>
      <div className="relative flex">
        <TextField
          label="مبدا"
          name="origin"
          slotProps={{ input: { className: 'rounded-e-none' } }}
        />
        <div className="absolute start-1/2 top-2 origin-center translate-x-5 rounded-full">
          <Fab color="primary" size="small">
            <SwapHorizIcon />
          </Fab>
        </div>
        <TextField
          label="مقصد"
          name="destination"
          slotProps={{ input: { className: 'rounded-s-none' } }}
        />
      </div>
      <TextField label="تاریخ رفت" name="departureDate" />
      <TextField
        label="تاریخ برگشت"
        name="returnDate"
        slotProps={{ input: { className: 'rounded-xl' } }}
      />
      <PassengerCount />
      <Button className="w-32" type="submit" variant={'contained'}>
        جستجو
      </Button>
    </form>
  );
};
