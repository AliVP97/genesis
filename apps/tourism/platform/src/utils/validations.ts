import { toLatin } from 'utils/helpers/numbers';
import { emailRegex } from 'utils/helpers/validations';

const isPhoneNumberValid = (phoneNumber: string) => {
  const phoneNumberLatin = toLatin(phoneNumber);
  const regEx = new RegExp('^(\\+98|0)?9\\d{9}$');
  return !!phoneNumberLatin.match(regEx);
};
const isNationalCodeValid = (nationalCode: string) => {
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

export const tourValidation = {
  FirstName: {
    required: { value: true, message: 'نام الزامی می باشد' },
    pattern: {
      value: /^[\u0600-\u06FF\s]+$/,
      message: 'نام را فارسی وارد کنید',
    },
  },
  LastName: {
    required: {
      value: true,
      message: 'نام خانوادگی الزامی می باشد',
    },
    pattern: {
      value: /^[\u0600-\u06FF\s]+$/,
      message: 'نام خانوادگی را فارسی وارد کنید',
    },
  },
  NationalCode: {
    required: { value: true, message: 'کد ملی الزامی می باشد' },
    validate: (value: string) => isNationalCodeValid(value) || 'کد ملی صحیح نمی‌باشد',
  },
  PassportNumber: {
    required: {
      value: true,
      message: 'شماره پاسپورت الزامی می باشد',
    },
  },
  PhoneNumber: {
    required: { value: true, message: 'شماره تلفن الزامی می باشد' },
    validate: (value: string) => isPhoneNumberValid(value) || 'شماره تلفن صحیح نمی‌باشد',
  },
  Email: {
    required: { value: true, message: 'ایمیل الزامی می باشد' },
    validate: (value: string) => emailRegex(value) || 'ایمیل وارد شده صحیح نمی‌باشد',
  },
  adultNumber: {
    required: {
      value: true,
      message: 'انتخاب تعداد مسافران بزرگسال الزامی می باشد',
    },
  },
  childNumber: {
    required: {
      value: false,
    },
  },
  infantNumber: {
    required: {
      value: false,
    },
  },
  description: {
    maxLength: 40,
  },
  tourDescription: {
    maxLength: 250,
  },
};
