import { OrderPassengerList } from 'services/domestic/orders/interface';

export const findUserInfoBaseOnTicketId = (
  orderPassengers: OrderPassengerList,
  ticketId: string,
) => {
  let foundItem = { passenger: {}, ticket: {} };
  orderPassengers!.forEach((passenger) => {
    passenger.tickets?.forEach((ticket) => {
      if (ticket.ticketId === ticketId) {
        foundItem = { passenger, ticket };
      }
    });
  });
  return foundItem;
};
