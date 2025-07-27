import { createContext, ReactNode, useState } from 'react';

const initialState = {
  uuidExpired: false,
  reserveExpired: false,
  checkExpiry: () => ({}),
};

interface ExpireInterface {
  uuidExpired: boolean;
  reserveExpired: boolean;
  checkExpiry: (action: { type: 'uuid' | 'reserve'; expired: boolean }) => void;
}

export const ExpireContext = createContext<ExpireInterface>(initialState);

export const ExpireProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(initialState);
  const checkExpiry = (action: { type: 'uuid' | 'reserve'; expired: boolean }) => {
    const { type, expired } = action;
    switch (type) {
      case 'uuid':
        setState({
          ...state,
          uuidExpired: expired,
        });
        return;
      case 'reserve':
        setState({
          ...state,
          reserveExpired: expired,
        });
      default:
        return;
    }
  };

  return (
    <ExpireContext.Provider
      value={{
        uuidExpired: state.uuidExpired,
        reserveExpired: state.reserveExpired,
        checkExpiry,
      }}
    >
      {children}
    </ExpireContext.Provider>
  );
};
