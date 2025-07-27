export const IntMobileValidation = (value: string) => {
  const MOBILE_REGEX = /^09\d{9}$/;
  const NUMBER_REGEX = /^[0-9]*$/;
  if (!value?.match(NUMBER_REGEX)) {
    return 'شماره موبایل صحیح نیست';
  }
  if (value.length === 11) {
    return !!value.match(MOBILE_REGEX) || 'شماره وارد شده صحیح نیست.لطفا مجدد وارد کنید';
  }
  return false;
};
