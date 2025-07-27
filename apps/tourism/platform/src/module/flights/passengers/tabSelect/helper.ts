import { NationalFormProps, PassportFormProps, ResultProps } from './interface';
import dayjs from 'dayjs';
import { Path, PathValue, UnpackNestedValue, UseFormSetValue } from 'react-hook-form';
import { ISelectedCountry } from 'containers/passengers/utilities/types';

export const twoDigit = (digit: number) => {
  return digit.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export const formFormatter = (data: NationalFormProps | PassportFormProps) => {
  const result: ResultProps = { ...data };
  const date = `${result?.BirthYear}/${result.BirthMonth}/${result?.BirthDay}`;
  const birthday = !result?.passportId
    ? dayjs(date).calendar('jalali').format('YYYY-MM-DD')
    : date.replace(/\//g, '-');
  Object.assign(result, {
    birthday,
    passengerType: 'PASSENGER_TYPE_NATIONAL_CARD',
  });
  delete result.BirthDay;
  delete result.BirthMonth;
  delete result.BirthYear;
  if (result?.passportId) {
    const passportExpireDate = `${result?.ExpireYear}-${result?.ExpireMonth}-${result?.ExpireDay}`;
    Object.assign(result, {
      passportExpireDate,
      passengerType:
        (result?.countryId as ISelectedCountry)?.countryAlpha2 == 'IR'
          ? 'PASSENGER_TYPE_BOTH'
          : 'PASSENGER_TYPE_PASSPORT',
      countryId: (result?.countryId as ISelectedCountry)?.value,
      ...((result?.countryId as ISelectedCountry)?.countryAlpha2 == 'IR'
        ? { nationalId: result?.nationalId }
        : { nationalId: '' }),
    });
    delete result.ExpireDay;
    delete result.ExpireMonth;
    delete result.ExpireYear;
  }
  return result;
};

export const convertDate = <T extends NationalFormProps | PassportFormProps>(
  date: string,
  type: { key: string; jalali?: boolean },
  setValue: UseFormSetValue<T>,
) => {
  const convertedDate = type.jalali ? dayjs(date).calendar('jalali').format('YYYY-M-D') : date;
  const dateList = convertedDate.split('-');
  if (type.key === 'birthday')
    dateList.map((item, index) => {
      if (!index) {
        setValue(
          'BirthYear' as Path<T>,
          // @ts-ignore
          item as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
      }
      if (index === 1)
        setValue(
          'BirthMonth' as Path<T>,
          // @ts-ignore
          twoDigit(parseInt(item)) as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
      if (index === 2)
        setValue(
          'BirthDay' as Path<T>,
          // @ts-ignore
          twoDigit(parseInt(item)) as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
    });
  else {
    if (date === '0001-01-01') return;
    dateList.map((item, index) => {
      if (!index)
        setValue(
          'ExpireYear' as Path<T>,
          // @ts-ignore
          item as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
      if (index === 1)
        setValue(
          'ExpireMonth' as Path<T>,
          // @ts-ignore
          twoDigit(parseInt(item)) as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
      if (index === 2)
        setValue(
          'ExpireDay' as Path<T>,
          // @ts-ignore
          twoDigit(parseInt(item)) as UnpackNestedValue<PathValue<T, Path<T>>>,
        );
    });
  }
};
