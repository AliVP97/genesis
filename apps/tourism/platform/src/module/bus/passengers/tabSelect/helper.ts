import dayjs from 'dayjs';
import { FieldValues, Path, PathValue, UnpackNestedValue, UseFormSetValue } from 'react-hook-form';
import { TPassengerType } from 'services/general/passenger/interface';

export const twoDigit = (digit: number) => {
  return digit.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export const formFormatter = (data: TPassengerType) => {
  const result: Partial<TPassengerType> = { ...data };

  if (result?.BirthYear && result.BirthMonth && result?.BirthDay) {
    const HijriBirthDate = `${result?.BirthYear}-${result.BirthMonth}-${result?.BirthDay}`;
    const birthday = dayjs(HijriBirthDate).calendar('jalali').format('YYYY-MM-DD');

    Object.assign(result, {
      birthdayString: birthday,
      hijriBirthdayString: HijriBirthDate,
    });
  }

  delete result.BirthDay;
  delete result.BirthMonth;
  delete result.BirthYear;

  if (result?.ExpireYear && result.ExpireMonth && result?.ExpireDay) {
    const passportExpireDateString = `${result?.ExpireYear}-${result.ExpireMonth}-${result?.ExpireDay}`;
    const hijriPassportExpiredDateString = dayjs(passportExpireDateString, {
      jalali: false,
    })
      .calendar('jalali')
      .format('YYYY-MM-DD');

    Object.assign(result, {
      passportExpireDateString,
      hijriPassportExpiredDateString,
      countryId: data?.countryObject?.id || (data?.countryObject as { value: string })?.value,
      passengerType: 'PASSENGER_TYPE_BOTH',
    });
  }

  delete result.ExpireDay;
  delete result.ExpireMonth;
  delete result.ExpireYear;

  Object.assign(result, {
    passengerType: result?.passengerType || 'PASSENGER_TYPE_NATIONAL_CARD',
  });

  return result as TPassengerType;
};

export const convertDate = <T extends FieldValues>(
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
