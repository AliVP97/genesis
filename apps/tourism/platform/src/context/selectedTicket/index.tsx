import { createContext, ReactNode, useEffect, useState } from 'react';
import { TicketType as FlightTicketType } from 'module/flights/tickets/ticket/interface';
import { resetFilters } from 'utils/helpers/resetFilters';
import { ParsedUrlQuery } from 'querystring';
import Router, { useRouter } from 'next/router';

const initialState = {
  selectedTicketDeparture: null,
  selectedTicketReturning: null,
  setSelectedTicketDeparture: () => ({}),
  setSelectedTicketReturning: () => ({}),
  handleChangeTowardTicket: () => ({}),
};

interface SelectedInfoInterface {
  selectedTicketDeparture: FlightTicketType | null;
  selectedTicketReturning: FlightTicketType | null;
  setSelectedTicketDeparture: (selected: {
    selectedTicketDeparture: FlightTicketType | null;
  }) => void;
  setSelectedTicketReturning: (selected: {
    selectedTicketReturning: FlightTicketType | null;
  }) => void;
  handleChangeTowardTicket: (query: ParsedUrlQuery, push: typeof Router.push) => void;
}

export const SelectedTicketContext = createContext<SelectedInfoInterface>(initialState);

export const SelectedTicketProvider = ({ children }: { children: ReactNode }) => {
  const { asPath, pathname } = useRouter();
  const [state, setState] = useState<SelectedInfoInterface>(initialState);

  const setSelectedTicketDeparture = (selectedTicketDeparture: {
    selectedTicketDeparture: FlightTicketType | null;
  }) => {
    setState({
      ...initialState,
      ...selectedTicketDeparture,
    });
  };
  const setSelectedTicketReturning = (selectedTicketReturning: {
    selectedTicketReturning: FlightTicketType | null;
  }) => {
    const selectedTicket = JSON.parse(localStorage.getItem('selected_ticket') as string);
    setState({
      ...initialState,
      selectedTicketDeparture: selectedTicket?.[0],
      ...selectedTicketReturning,
    });
  };

  const handleChangeTowardTicket = (query: ParsedUrlQuery, push: typeof Router.push) => {
    resetFilters(query, push);
  };

  //Display the ticket info in the checkout and passenger pages
  useEffect(() => {
    if (/flights\/(checkout|passengers)/.test(pathname)) {
      const selectedTicket = JSON.parse(
        localStorage.getItem('selected_ticket') as string,
      ) as FlightTicketType[];
      if (selectedTicket) {
        setSelectedTicketDeparture({
          selectedTicketDeparture: selectedTicket[0],
        });
        setSelectedTicketReturning({
          selectedTicketReturning: selectedTicket[1],
        });
      }
    }
  }, [asPath]);

  return (
    <SelectedTicketContext.Provider
      value={{
        selectedTicketDeparture: state.selectedTicketDeparture,
        selectedTicketReturning: state.selectedTicketReturning,
        setSelectedTicketDeparture,
        setSelectedTicketReturning,
        handleChangeTowardTicket,
      }}
    >
      {children}
    </SelectedTicketContext.Provider>
  );
};
