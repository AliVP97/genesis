import React, { createContext, ReactNode, useContext } from 'react';
import { FlightDictionary } from './types/FlightDictionary';
import Itinerary from './types/Itinerary';

interface TicketContextProps {
  itinerary: Itinerary | undefined;
  dictionary: FlightDictionary;
  showDetails: boolean;
  curveEdges?: boolean;
  summaryTitle?: string;
}

const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const useTicket = () => {
  const context = useContext(TicketContext);

  if (context === undefined) {
    throw new Error('useTicket must be used within a TicketProvider');
  }

  return context;
};

interface TicketProviderProps {
  children: ReactNode;
  value: TicketContextProps;
}

export const TicketProvider = ({ children, value }: TicketProviderProps) => (
  <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
);
