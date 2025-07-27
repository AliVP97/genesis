export const VisaType = {
  new: 'جدید',
  renewal: 'درخواست تمدید',
};

export type TVisaAddToCartEvent = {
  quantity: number;
  item_varient: string; // Visa-type
  item_category2: number; // New|Renewal
  item_brand: string; // Country
  transactionID?: string;
};

export interface IVisa {
  visaTitle: string;
  brand: string;
}
