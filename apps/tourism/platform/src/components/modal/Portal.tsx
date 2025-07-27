import { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.scss';
interface Props {
  children: ReactNode;
  visible: boolean;
}
const Portal = ({ children, visible }: Props) => {
  const [mounted, setMount] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current = document.querySelector('#portal-root');
    if (visible) {
      document.documentElement.classList.add(styles['stop-scrolling']);
    } else {
      document.documentElement.classList.remove(styles['stop-scrolling']);
    }
  }, [visible]);

  useEffect(() => {
    setMount(true);
    return () => {
      document.documentElement.classList.remove(styles['stop-scrolling']);
      setMount(false);
    };
  }, []);

  return mounted && ref.current ? ReactDOM.createPortal(children, ref.current) : null;
};

export default Portal;
