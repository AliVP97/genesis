import { emailRegex } from 'utils/helpers/validations';
import { toLatin } from 'utils/helpers/numbers';

const isPhoneNumberValid = (phoneNumber: string) => {
  const phoneNumberLatin = toLatin(phoneNumber);
  const regEx = new RegExp('^(\\+98|0)?9\\d{9}$');
  return !!phoneNumberLatin.match(regEx);
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
};
