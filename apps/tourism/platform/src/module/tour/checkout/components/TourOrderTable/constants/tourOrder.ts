import { FromSchema } from 'containers/passengers/utilities/types';
import { tourValidation } from 'utils/validations';

export const domesticPersonalDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'firstName',
      label: 'نام ',
      type: 'text',
      placeholder: '',
      rules: tourValidation.FirstName,
      visible: true,
    },
    {
      name: 'lastName',
      label: 'نام خانوادگی ',
      type: 'text',
      placeholder: '',
      rules: tourValidation.LastName,
      visible: true,
    },
    {
      name: 'nationalCode',
      label: 'کد ملی',
      type: 'text',
      placeholder: '',
      rules: tourValidation.NationalCode,
      visible: true,
    },
    {
      name: 'email',
      label: 'ایمیل',
      type: 'text',
      placeholder: '',
      rules: tourValidation.Email,
      visible: true,
    },
  ],
];
export const internationalPersonalDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'passportNo',
      label: 'شماره پاسپورت',
      type: 'text',
      placeholder: '',
      rules: tourValidation.PassportNumber,
      visible: true,
    },
    {
      name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
      label: 'تاریخ انقضای پاسپورت',
      type: 'timeSelector',
      isJalali: false,
      isEnMonthDaysFull: true,
      rules: {
        required: {
          value: true,
          message: 'تاریخ انقضای پاسپورت الزامی می باشد',
        },
      },
      visible: true,
    },
  ],
];

export const oneDayPassengersDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'adultNumber',
      label: 'تعداد بزرگسال ',
      type: 'select',
      placeholder: '',
      rules: tourValidation.adultNumber,
      visible: true,
    },
    {
      name: 'childNumber',
      label: 'تعداد کودک (3  تا 12  سال)',
      type: 'select',
      placeholder: '',
      rules: tourValidation.childNumber,
      visible: true,
    },
    {
      name: 'infantNumber',
      label: 'تعداد نوزاد (0  تا 2  سال)',
      type: 'select',
      placeholder: '',
      rules: tourValidation.infantNumber,
      visible: true,
    },
  ],
];

export const passengersDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'adultNumber',
      label: 'تعداد بزرگسال ',
      type: 'select',
      placeholder: '',
      rules: tourValidation.adultNumber,
      visible: true,
      defaultValue: '2',
    },
    {
      name: 'childNumber',
      label: 'تعداد کودک با تخت (7  تا 12  سال)',
      type: 'select',
      placeholder: '',
      rules: tourValidation.childNumber,
      visible: true,
    },
    {
      name: 'childWithoutBedNumber',
      label: 'تعداد کودک بدون تخت (3  تا 6  سال)',
      type: 'select',
      placeholder: '',
      rules: tourValidation.childNumber,
      visible: true,
    },
    {
      name: 'infantNumber',
      label: 'تعداد نوزاد (0  تا 2  سال)',
      type: 'select',
      placeholder: '',
      rules: tourValidation.infantNumber,
      visible: true,
    },
  ],
];

export const commentDynamicForms: Array<Array<FromSchema>> = [
  [
    {
      name: 'description',
      label: 'توضیحات',
      type: 'text',
      placeholder: '',
      visible: true,
      rules: {
        maxLength: 250,
      },
    },
  ],
];
