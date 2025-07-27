import { validations } from './validations';
import { TFormsSchema } from './types';

type TFormSchema = (isInternational?: boolean) => TFormsSchema;

export const formsSchema: TFormSchema = (isInternational = false) => [
  [
    {
      name: 'passportCountry',
      label: 'کشور صادر کننده پاسپورت',
      type: 'countrySelector',
      placeholder: '',
      defaultValue: {
        label: 'ایران',
        value: '201',
        enLabel: 'Iran',
        countryAlpha2: 'IR',
        countryAlpha3: 'IRN',
      },
      rules: validations.PassportCountry,
      visiblity: 'all',
    },
    {
      name: 'persianName',
      label: 'نام',
      type: 'text',
      placeholder: '',
      rules: validations.FirstName,
      visiblity: isInternational ? 'all' : 'domestic',
    },
    {
      name: 'persianFamily',
      label: 'نام خانوادگی',
      type: 'text',
      placeholder: '',
      rules: validations.LastName,
      visiblity: isInternational ? 'all' : 'domestic',
    },
    {
      name: 'englishName',
      label: 'نام لاتین (مطابق با پاسپورت)',
      type: 'text',
      placeholder: '',
      rules: validations.LatinFirstName,
      visiblity: isInternational ? 'all' : 'foreign',
      upperCase: true,
    },
    {
      name: 'englishFamily',
      label: 'نام خانوادگی لاتین (مطابق با پاسپورت)',
      type: 'text',
      placeholder: '',
      rules: validations.LatinLastName,
      visiblity: isInternational ? 'all' : 'foreign',
      upperCase: true,
    },
    {
      name: 'gender',
      label: 'جنسیت',
      type: 'genderSelector',
      rules: validations.Gender,
      visiblity: 'all',
    },
    {
      name: 'nationalId',
      label: 'کد ملی',
      type: 'text',
      inputMode: 'numeric',
      placeholder: '',
      rules: validations.NationalCode,
      visiblity: 'domestic',
    },
    {
      name: ['BirthDay', 'BirthMonth', 'BirthYear'],
      timestampFieldName: 'birthday',
      label: 'تاریخ تولد',
      type: 'timeSelector',
      isJalali: true,
      rules: {
        required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
      },
      visiblity: 'domestic',
    },
    {
      name: 'passportId',
      label: 'شماره پاسپورت',
      type: 'text',
      placeholder: '',
      rules: validations.PassportNumber,
      visiblity: 'foreign',
    },
    {
      name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
      timestampFieldName: 'passportExpireDate',
      label: 'تاریخ انقضای پاسپورت',
      type: 'timeSelector',
      isJalali: false,
      rules: {
        required: {
          value: true,
          message: 'تاریخ انقضای پاسپورت الزامی می باشد',
        },
      },
      visiblity: 'foreign',
    },
    {
      name: ['BirthDay', 'BirthMonth', 'BirthYear'],
      timestampFieldName: 'birthday',
      label: 'تاریخ تولد',
      type: 'timeSelector',
      isJalali: false,
      rules: {
        required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
      },
      visiblity: 'foreign',
    },
  ],
];
