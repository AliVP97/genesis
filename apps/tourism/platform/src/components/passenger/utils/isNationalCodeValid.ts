import { toLatin } from 'utils/helpers/numbers';

export const isNationalCodeValid = (nationalCode: string) => {
  const common = [
    '0000000000',
    '1111111111',
    '2222222222',
    '3333333333',
    '4444444444',
    '5555555555',
    '6666666666',
    '7777777777',
    '8888888888',
    '9999999999',
  ];

  nationalCode = toLatin(nationalCode);

  if (!/^\d{10}$/.test(nationalCode)) return false;

  if (common.includes(nationalCode)) return false;

  const check = +nationalCode[9];
  const sum =
    Array(9)
      .fill('')
      .map((_, i) => +nationalCode[i] * (10 - i))
      .reduce((x, y) => x + y) % 11;
  return (sum < 2 && check == sum) || (sum >= 2 && check + sum == 11);
};
