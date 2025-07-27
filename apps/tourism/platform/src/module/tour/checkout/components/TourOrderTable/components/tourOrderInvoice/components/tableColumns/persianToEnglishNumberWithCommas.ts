export const persianToEnglishNumberWithCommas = (persianNum: string) => {
  if (!persianNum) return persianNum;
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const englishNum = String(persianNum)
    .split('')
    .map((char) => {
      const index = persianDigits.indexOf(char);
      return index !== -1 ? englishDigits[index] : char;
    })
    .join('')
    .replace(/٬/g, '')
    .replace(/,/g, '');
  return Number(englishNum).toLocaleString('en-US');
};
