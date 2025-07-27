import { TDaysContents } from 'containers/datepicker/datepicker/types';
import { CSSProperties } from 'react';

type SecondaryData = TDaysContents[string]['secondaryData'];

const ALLOWED_STYLES = ['color', 'font-size', 'font-weight', 'text-decoration'];

const DEFAULT_DATA: SecondaryData = { textContent: '' };

const capitalizeAfterDash = (str: string) => str.replace(/-(\w)/g, (_, char) => char.toUpperCase());

const extractData = (regexResult: RegExpMatchArray): SecondaryData => {
  const cssProperties = {} as Record<keyof CSSProperties, string>;
  const [, rawStyles, textContent] = regexResult;

  for (const style of rawStyles.split(' ')) {
    const [key, value] = style.split('=');

    if (ALLOWED_STYLES.includes(key)) {
      const styleValue = value.trim().replace(/[<"']/g, '');
      const cssProperty = capitalizeAfterDash(key) as keyof CSSProperties;
      cssProperties[cssProperty] = styleValue;
    }
  }

  return { textContent, style: cssProperties as CSSProperties };
};

const getSecondaryData = (rawData: string): SecondaryData => {
  try {
    const result = rawData.match(/<font(.*)>(.*)<\/font>/);

    if (!result || result.length < 3) {
      return DEFAULT_DATA;
    }

    return extractData(result);
  } catch {
    return DEFAULT_DATA;
  }
};

export default getSecondaryData;
