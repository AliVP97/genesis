import { FC } from 'react';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import { Button, TextField, Typography } from '@780/ui';

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
      <Typography variant="too-small-bold" className="mb-4">
        جستجوی بلیط اتوبوس
      </Typography>
      <div className="relative flex">
        <TextField
          label="مبدا"
          name="origin"
          slotProps={{ input: { className: '!rounded-s-xl !rounded-e-none' } }}
        />
        <Button
          className="!absolute start-1/2 top-2 h-10 !w-10 !min-w-10 origin-center translate-x-5 !rounded-full !p-0"
          variant="contained"
        >
          <SwapHorizIcon />
        </Button>
        <TextField
          label="مقصد"
          name="destination"
          slotProps={{ input: { className: '!rounded-s-none !rounded-e-xl' } }}
        />
      </div>
      <TextField
        label="تاریخ رفت"
        name="departureDate"
        slotProps={{ input: { className: '!rounded-xl' } }}
      />
      <TextField
        label="تاریخ برگشت"
        name="returnDate"
        slotProps={{ input: { className: '!rounded-xl' } }}
      />
      <PassengerCount />
      <Button className="w-32 !rounded-xl" type="submit" variant={'contained'}>
        جستجو
      </Button>
    </form>
  );
};
