import { createContext, FC, useContext, useState } from 'react';

interface CardContextProps {
  isExpandable?: boolean;
  isExpand: boolean;
  setIsExpand: (value: boolean) => void;
}

export const CardContext = createContext<CardContextProps>({
  isExpandable: false,
  isExpand: true,
  setIsExpand: () => {
    // eslint-disable-next-line no-console
  },
});

export const useCard = () => {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }

  return context;
};

export const CardProvider: FC<{
  isExpandable: boolean;
  isExpanded: boolean | null;
}> = ({ children, isExpandable, isExpanded }) => {
  const [isExpand, setIsExpand] = useState(isExpanded ?? true);

  return (
    <CardContext.Provider value={{ isExpand, setIsExpand, isExpandable }}>
      {children}
    </CardContext.Provider>
  );
};
