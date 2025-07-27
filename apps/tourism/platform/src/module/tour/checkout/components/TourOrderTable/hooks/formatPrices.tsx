import { NumberSeparator } from 'utils/helpers/numbers';

export const formatPrice = (tomanPrice?: string, usdPrice?: string) => {
  return `${usdPrice ? `${NumberSeparator(usdPrice)}$ + ` : ''}${
    tomanPrice ? NumberSeparator(tomanPrice) : ''
  }`;
};
