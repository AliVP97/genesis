import { FromSchema } from 'containers/passengers/utilities/types';
import { validations } from 'module/train/passengers/form/validations';
export const dynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'englishName',
      label: 'نام لاتین',
      type: 'text',
      placeholder: '',
      rules: validations.LatinFirstName,
      visible: true,
    },
    {
      name: 'englishFamily',
      label: 'نام خانوادگی لاتین',
      type: 'text',
      placeholder: '',
      rules: validations.LatinLastName,
      visible: true,
    },
    {
      name: ['BirthDay', 'BirthMonth', 'BirthYear'],
      label: 'تاریخ تولد',
      type: 'timeSelector',
      isJalali: false,
      rules: {
        required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
      },
      visible: true,
    },
    {
      name: 'gender',
      label: 'جنسیت',
      type: 'genderSelector',
      rules: validations.Gender,
      visible: true,
    },

    {
      name: 'passportId',
      label: 'شماره پاسپورت',
      type: 'text',
      placeholder: '',
      rules: validations.PassportNumber,
      visible: true,
    },
    {
      name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
      label: 'تاریخ انقضای پاسپورت',
      type: 'timeSelector',
      isJalali: false,
      rules: {
        required: { value: true, message: 'تاریخ انقضای پاسپورت الزامی می باشد' },
      },
      visible: true,
    },
    {
      name: 'passportCountry',
      label: 'کشور صادر کننده پاسپورت',
      type: 'countrySelector',
      placeholder: '',
      rules: validations.PassportCountry,
      visible: true,
    },

    {
      name: 'nationalId',
      label: 'کد ملی',
      type: 'text',
      inputMode: 'numeric',
      placeholder: '',
      rules: validations.NationalCode,
      visible: false,
    },
  ],
];

export const nationalCodeDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'persianName',
      label: 'نام',
      type: 'text',
      placeholder: '',
      rules: validations.FirstName,
      visible: true,
    },
    {
      name: 'persianFamily',
      label: 'نام خانوادگی',
      type: 'text',
      placeholder: '',
      rules: validations.LastName,
      visible: true,
    },
    {
      name: 'englishName',
      label: 'نام لاتین',
      type: 'text',
      placeholder: '',
      rules: validations.LatinFirstName,
      visible: true,
    },
    {
      name: 'englishFamily',
      label: 'نام خانوادگی لاتین',
      type: 'text',
      placeholder: '',
      rules: validations.LatinLastName,
      visible: true,
    },
    {
      name: ['BirthDay', 'BirthMonth', 'BirthYear'],
      label: 'تاریخ تولد',
      type: 'timeSelector',
      isJalali: true,
      rules: {
        required: { value: true, message: 'جنسیت الزامی می باشد' },
      },
      visible: true,
    },
    {
      name: 'gender',
      label: 'جنسیت',
      type: 'genderSelector',
      rules: validations.Gender,
      visible: true,
    },
    {
      name: 'nationalId',
      label: 'کد ملی',
      type: 'text',
      inputMode: 'numeric',
      placeholder: '',
      rules: validations.NationalCode,
      visible: true,
    },
  ],
];
