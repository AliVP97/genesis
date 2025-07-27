import React, { useEffect } from 'react';
import Header from './header';
import useOnScreen from 'utils/hooks/useOnScreen';
import { trackEvent } from 'utils/helpers/analytics';
import styles from './style.module.scss';
import { MagProps } from './types';
import MagItem from './magazineItem';

function Mag({ title, items }: MagProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(sectionRef);
  const firstFourItems = items?.slice(0, 4);
  useEffect(() => {
    if (isVisible) {
      trackEvent({
        action: 'view',
        category: 'Magazine',
        label: 'Flight Magazine Banner',
        value: 1,
      });
    }
  }, [isVisible]);
  return (
    <div dir="rtl" className="my-4">
      <div className={styles.magazine} ref={sectionRef}>
        <div className="container">
          <Header title={title} />
        </div>
        <div className="container ltr">
          <div className={styles.magazine__body}>
            {firstFourItems?.map((item, index) => {
              return (
                <div key={index.toString() + item.title}>
                  <MagItem data={item} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mag;
