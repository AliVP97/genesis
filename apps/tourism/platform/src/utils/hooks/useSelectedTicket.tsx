import { useContext } from 'react';
import { SelectedTicketContext } from 'context/selectedTicket';

export const useSelectedTicket = () => {
  return useContext(SelectedTicketContext);
};
