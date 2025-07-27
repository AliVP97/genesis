import { useEffect, useState } from 'react';

import { TActiveInput } from '../types';
import { TTourPassenger } from '../../passengerPicker/types';
import { useRouter } from 'next/router';

export const usePassenger = (activeInput: TActiveInput) => {
  const router = useRouter();

  const [showPassenger, setShowPassenger] = useState(false);
  const [passengers, setPassengers] = useState<TTourPassenger>({
    adult: Number(router.query?.adult) || 1,
    child: Array.isArray(router.query?.child)
      ? router.query.child.length
      : typeof router.query?.child === 'string'
        ? router.query.child.split(',').length
        : 0,
    childAges: Array.isArray(router.query?.child)
      ? router.query.child.map((age) => Number(age))
      : typeof router.query?.child === 'string'
        ? router.query.child.split(',').map((age) => Number(age))
        : [],
  });

  useEffect(() => {
    if (activeInput === 'passenger') {
      setShowPassenger(true);
    }
  }, [activeInput]);

  return {
    passengers,
    setPassengers,
    showPassenger,
    setShowPassenger,
  };
};
