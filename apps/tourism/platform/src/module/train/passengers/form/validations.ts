import { toLatin } from 'utils/helpers/numbers';
import { validationMobile } from '../../../../utils/helpers/validations';

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

export const validations = {
  LatinFirstName: {
    required: { value: true, message: 'نام لاتین الزامی می باشد' },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'نام لاتین باید انگلیسی باشد',
    },
  },
  LatinLastName: {
    required: {
      value: true,
      message: 'نام خانوادگی لاتین الزامی می باشد',
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'نام خانوادگی لاتین باید انگلیسی باشد',
    },
  },
  FirstName: {
    required: { value: true, message: 'نام الزامی می باشد' },
    pattern: {
      value: /^[\u0600-\u06FF\s]+$/,
      message: 'نام را فارسی وارد کنید',
    },
  },
  LastName: {
    required: { value: true, message: 'نام خانوادگی الزامی می باشد' },
    pattern: {
      value: /^[\u0600-\u06FF\s]+$/,
      message: 'نام خانوادگی را فارسی وارد کنید',
    },
  },
  Gender: {
    required: { value: true, message: 'جنسیت الزامی می باشد' },
  },
  PassportCountry: {
    required: {
      value: true,
      message: 'کشور صادرکننده پاسپورت الزامی می باشد',
    },
  },
  PassportNumber: {
    required: {
      value: true,
      message: 'شماره پاسپورت الزامی می باشد',
    },
  },
  NationalCode: {
    required: { value: true, message: 'کد ملی الزامی می باشد' },
    validate: (value: string) => isNationalCodeValid(value) || 'کد ملی صحیح نمی‌باشد',
  },
  PhoneNumber: {
    required: { value: true, message: 'شماره موبایل الزامی می باشد' },
    validate: (value: string) => validationMobile(value) || 'شماره موبایل صحیح نمی‌باشد',
  },
};
