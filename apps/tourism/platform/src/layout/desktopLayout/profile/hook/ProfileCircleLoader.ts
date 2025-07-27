import { useState, useEffect } from 'react';

const useCircleFill = (percentage: number) => {
  const [currentFill, setCurrentFill] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = (percentage / 1000) * 10; // Increment calculation

    const interval = setInterval(() => {
      start += increment;
      if (start >= percentage) {
        start = percentage;
        clearInterval(interval); // Stop at the target percentage
      }
      setCurrentFill(start);
    }, 10); // Update every 10ms for smooth animation

    return () => clearInterval(interval); // Cleanup on unmount
  }, [percentage]);

  return currentFill;
};

export default useCircleFill;
