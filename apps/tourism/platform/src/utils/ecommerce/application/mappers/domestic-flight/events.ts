import { IDomesticFlightTrackingRepository } from 'utils/ecommerce/domain/repositories';
import { Currency } from 'utils/ecommerce/domain/constants';
import { propsModel } from './types';
import { createTrackingEvent } from 'utils/ecommerce/googleTagManager';
import { BaseTrackingEventActionsType } from 'utils/ecommerce/domain/baseActionTypes';
import { SearchHistory } from 'module/flights/tickets/ticket/searchTicket/interface';
import { captureException } from 'utils/ecommerce/errorHandeling';
import { generateDataLayerObject, returnFlight } from './helper';
import { IPurchasePropsModel } from 'utils/ecommerce/domain/models';

export class DomesticFlightTrackingEvent implements IDomesticFlightTrackingRepository {
  viewItemList(items: propsModel): void {
    try {
      const { ticketsData, query, locations } = items;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_ITEM_LIST,
        value: generateDataLayerObject({
          flights: returnFlight(ticketsData),
          query,
          locations: locations as SearchHistory,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  selectItem(item: propsModel, index: number): void {
    try {
      const { query, locations, itinerary } = item;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.SELECT_ITEM,
        value: generateDataLayerObject({
          flights: itinerary! as [],
          query,
          locations: locations as SearchHistory,
          index,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addToCart(item: propsModel): void {
    try {
      const { query, locations, itinerary, index } = item;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.ADD_TO_CART,
        value: generateDataLayerObject({
          flights: itinerary! as [],
          query,
          locations: locations as SearchHistory,
          index: index as number,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  viewCart(item: propsModel): void {
    try {
      const { query, locations, itinerary, index, passengerLength } = item;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.VIEW_CART,
        value: generateDataLayerObject({
          flights: itinerary! as [],
          query,
          locations: locations as SearchHistory,
          index: index as number,
          passengerLength: passengerLength as number,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  addPaymentInfo(item: propsModel, paymentGateway: string | undefined): void {
    try {
      const { query, locations, itinerary, index, passengerLength } = item;
      const optional = {
        payment_type: paymentGateway,
      };
      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.ADD_PAYMENT_INFO,
          value: generateDataLayerObject({
            flights: itinerary! as [],
            query,
            locations: locations as SearchHistory,
            index: index as number,
            passengerLength: passengerLength as number,
          }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
  beginCheckout(item: propsModel): void {
    try {
      const { query, locations, itinerary, index } = item;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.BEGIN_CHECKOUT,
        value: generateDataLayerObject({
          flights: itinerary! as [],
          query,
          locations: locations as SearchHistory,
          index: index as number,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  removeFromCart(item: propsModel): void {
    try {
      const { query, locations, itinerary, index } = item;
      createTrackingEvent({
        type: BaseTrackingEventActionsType.REMOVE_FROM_CART,
        value: generateDataLayerObject({
          flights: itinerary! as [],
          query,
          locations: locations as SearchHistory,
          index: index as number,
        }),
      });
    } catch (error) {
      captureException(error);
    }
  }
  purchase(item: propsModel, props: IPurchasePropsModel): void {
    try {
      const { query, locations, itinerary, index, passengerLength } = item;

      const optional = {
        currency: Currency.TRY,
        value: props.price ? parseInt(props.price as string) : 0,
        transaction_id: props.rrn,
      };
      createTrackingEvent(
        {
          type: BaseTrackingEventActionsType.PURCHASE,
          value: generateDataLayerObject({
            flights: itinerary! as [],
            query,
            locations: locations as SearchHistory,
            index: index as number,
            passengerLength: passengerLength as number,
          }),
        },
        optional,
      );
    } catch (error) {
      captureException(error);
    }
  }
}
