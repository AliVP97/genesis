import { useCallback, useState } from 'react';

const useCheckedIndex = () => {
  const [checkedIndex, setCheckedIndex] = useState(0);

  const handleCheckedIndexChange = useCallback((value: string) => {
    setCheckedIndex(Number(value));
  }, []);

  return { handleCheckedIndexChange, checkedIndex };
};

export default useCheckedIndex;
