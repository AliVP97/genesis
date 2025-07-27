export const BaseTrackingEventActionsType = {
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  VIEW_ITEM: 'view_item',
  VIEW_CART: 'view_cart',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  REMOVE_FROM_CART: 'remove_from_cart',
  PURCHASE: 'purchase',
  SEARCH: 'search',
} as const;

type baseEventActionType = typeof BaseTrackingEventActionsType;
export type BaseTrackingEventActionType = baseEventActionType[keyof baseEventActionType];
