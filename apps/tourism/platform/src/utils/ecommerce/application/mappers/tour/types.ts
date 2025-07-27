import { TProgramItem } from 'containers/landingPage/types';

export interface IAddToCart {
  data: TProgramItem;
  cityName: string;
  tourId: number;
  tourTitle: string;
}

export type TTourSelectItem = {
  item_id: string;
  item_name: string;
  item_list_name: string;
  item_list_id: string;
  item_brand: string;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_category4: string;
  Item_variant: 'امکانات تور';
  price: '123750000';
  index: number;
  quantity: '';
};
