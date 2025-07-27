const AR_NUMBERS: string[] = [
  '۰',
  '۱',
  '۲',
  '۳',
  '۴',
  '۵',
  '۶',
  '۷',
  '۸',
  '۹',
  '٠',
  '١',
  '٢',
  '٣',
  '٤',
  '٥',
  '٦',
  '٧',
  '٨',
  '٩',
];
export const toLatin = function (v: string) {
  return (v || '').replace(/[۰-۹٠-٩]/g, (w) => (AR_NUMBERS.indexOf(w) % 10).toString());
};

export const transformInputToLatin = (el: HTMLInputElement, onlyNumber = false) => {
  let value = toLatin(el.value);
  if (onlyNumber) {
    value = value.replace(/[^0-9]/g, '');
  }
  if (el.value !== value) {
    el.value = value;
    el.dispatchEvent(new Event('input'));
  }
};

export const NumberSeparator = (price?: string) => {
  return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function fixNumbers(str: string): string {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];

  const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  const allNumbers = [...persianNumbers, ...arabicNumbers];
  if (typeof str === 'string') {
    for (let i = 0; i < 20; i++) {
      str = str.replace(allNumbers[i], String(i % 10));
    }
  }
  return str;
}
