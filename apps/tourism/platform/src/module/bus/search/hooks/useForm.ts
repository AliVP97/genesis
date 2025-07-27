import { useState } from 'react';

export const useForm = () => {
  const [activeInput, setActiveInput] = useState<'datepicker' | 'passenger' | null>(null);
  const nextInput = (input: 'datepicker' | null) => {
    setActiveInput(input);
  };

  return { activeInput, nextInput };
};
