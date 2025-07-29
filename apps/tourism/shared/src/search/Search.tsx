import { Button, TextField } from '@780/ui';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { FC } from 'react';

import { PassengerCount } from '../passenger-count';

type SearchProps = {
  onSubmit?: (data: any) => void;
};

export const Search: FC<SearchProps> = ({ onSubmit }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form className="flex justify-center gap-4 p-20" onSubmit={submitHandler}>
      <TextField
        label="مبدا"
        name="origin"
        slotProps={{ input: { className: '!rounded-s-xl !rounded-e-none' } }}
      />
      <Button className="absolute start-0 top-1/2 !hidden">
        <SwapHorizIcon />
      </Button>
      <TextField
        label="مقصد"
        name="destination"
        slotProps={{ input: { className: '!rounded-e-xl' } }}
      />
      <TextField label="تاریخ رفت" name="departureDate" />
      <TextField label="تاریخ برگشت" name="returnDate" />
      <PassengerCount />
      <Button type="submit">جستجو سفر</Button>
    </form>
  );
};
