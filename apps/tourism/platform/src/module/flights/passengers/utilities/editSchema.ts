import { TPassengerV2 } from 'services/general/passenger/interface';
import { validations } from '../form/validations';
import { TypeProps } from '../tabSelect/interface';
import { FromSchema, ISelectedCountry } from 'containers/passengers/utilities/types';

export const DomesticFlightEditSchema = (
  passenger: TPassengerV2,
  type: TypeProps,
): Array<Array<FromSchema>> => {
  const list: Array<Array<FromSchema>> = [[]];
  if (type === 'passport') {
    list.push([
      {
        name: 'englishName',
        label: 'نام لاتین',
        type: 'text',
        placeholder: '',
        defaultValue: passenger.englishName,
        rules: validations.LatinFirstName,
        visible: true,
      },
      {
        name: 'englishFamily',
        label: 'نام خانوادگی لاتین',
        type: 'text',
        placeholder: '',
        defaultValue: passenger?.englishFamily,
        rules: validations.LatinLastName,
        visible: true,
      },
      {
        name: ['BirthDay', 'BirthMonth', 'BirthYear'],
        label: 'تاریخ تولد',
        type: 'timeSelector',
        isJalali: false,
        defaultValue: passenger.birthday != '0' ? passenger.birthday : '',
        rules: {
          required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
        },
        visible: true,
      },
      {
        name: 'gender',
        label: 'جنسیت',
        type: 'genderSelector',
        defaultValue: passenger?.gender,
        rules: validations.Gender,
        visible: true,
      },
      {
        name: 'passportId',
        label: 'شماره پاسپورت',
        type: 'text',
        placeholder: '',
        defaultValue: passenger?.passportId,
        rules: validations.PassportNumber,
        visible: true,
      },
      {
        name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
        label: 'تاریخ انقضای پاسپورت',
        type: 'timeSelector',
        isJalali: false,
        defaultValue:
          Number(passenger?.passportExpireDate) > 0 ? passenger?.passportExpireDate : undefined,
        rules: {
          required: {
            value: true,
            message: 'تاریخ انقضای پاسپورت الزامی می باشد',
          },
        },
        visible: true,
      },
      {
        name: 'passportCountry',
        label: 'کشور صادر کننده پاسپورت',
        type: 'countrySelector',
        placeholder: '',
        defaultValue:
          Number(passenger?.countryObject?.id) <= 0
            ? undefined
            : ({
                countryAlpha2: passenger?.countryObject?.countryAlpha2,
                value: passenger?.countryObject?.id,
              } as ISelectedCountry),
        rules: validations.PassportCountry || null,
        visible: true,
      },
      {
        name: 'nationalId',
        label: 'کد ملی',
        type: 'text',
        inputMode: 'numeric',
        placeholder: '',
        defaultValue: passenger?.nationalId,
        rules: validations.NationalCode,
        visible: false,
      },
    ]);
  } else {
    list.push([
      {
        name: 'persianName',
        label: 'نام',
        type: 'text',
        placeholder: '',
        rules: validations.FirstName,
        defaultValue: passenger.persianName,
        visible: true,
      },
      {
        name: 'persianFamily',
        label: 'نام خانوادگی',
        type: 'text',
        placeholder: '',
        rules: validations.LastName,
        defaultValue: passenger?.persianFamily,
        visible: true,
      },
      {
        name: 'englishName',
        label: 'نام لاتین',
        type: 'text',
        placeholder: '',
        rules: validations.LatinFirstName,
        defaultValue: passenger?.englishName,
        visible: true,
      },
      {
        name: 'englishFamily',
        label: 'نام خانوادگی لاتین',
        type: 'text',
        placeholder: '',
        rules: validations.LatinLastName,
        defaultValue: passenger?.englishFamily,
        visible: true,
      },
      {
        name: ['BirthDay', 'BirthMonth', 'BirthYear'],
        label: 'تاریخ تولد',
        type: 'timeSelector',
        isJalali: true,
        rules: {
          required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
        },
        visible: true,
        defaultValue: passenger?.birthday === '0' ? undefined : passenger?.birthday,
      },
      {
        name: 'gender',
        label: 'جنسیت',
        type: 'genderSelector',
        rules: validations.Gender,
        defaultValue: passenger?.gender,
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
        defaultValue: passenger?.nationalId,
      },
    ]);
  }
  return list;
};
