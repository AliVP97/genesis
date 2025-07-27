export const isPersian = (text: string): boolean => /[\u0600-\u06FF]/.test(text);

export const getTextDirection = (text: string): 'rtl' | 'ltr' => (isPersian(text) ? 'rtl' : 'ltr');
