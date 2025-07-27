import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const HeaderIconHoc = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    return () => {
      setMount(false);
    };
  }, []);
  useEffect(() => {
    ref.current = document.querySelector('#header-icon-portal');
  }, []);
  return ref.current && mounted ? ReactDOM.createPortal(children, ref.current) : null;
};

export default HeaderIconHoc;
