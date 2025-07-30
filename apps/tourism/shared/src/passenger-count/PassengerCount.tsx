import { TextField } from '@mui/material';

// const PASSENGER_TYPES = [
//   {
//     label: 'بزرگسال',
//     max: 10,
//     min: 1,
//     name: 'adult',
//   },
// ];

export const PassengerCount = () => {
  return (
    <TextField
      label="تعداد مسافر"
      name="passengerCount"
      slotProps={{ input: { className: '!rounded-xl' } }}
      type="number"
    />
  );
};
