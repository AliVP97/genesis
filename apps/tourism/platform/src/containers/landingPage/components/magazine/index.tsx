import React, { useEffect } from 'react';
import Header from './header';
import { IMagazine } from 'containers/landingPage/types';
import MagazineItem from './magazineItem';
import useOnScreen from 'utils/hooks/useOnScreen';
import { trackEvent } from 'utils/helpers/analytics';
import styles from './magazine.module.scss';

type MagazinePropsType = {
  magazines: Array<IMagazine>;
};

function Magazine({ magazines }: MagazinePropsType) {
  // TODO above code is temporary for test google analytics user tracking
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(sectionRef);
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
  // TODO END -----------------------------------------------
  return (
    <section>
      <div className={styles['magazine']} ref={sectionRef}>
        <div className="container">
          <Header />
        </div>
        <div className="container ltr">
          <div className={styles['magazine__body']}>
            {magazines.map((item, index) => {
              return (
                <div key={index.toString() + item.title}>
                  <MagazineItem magazine={item} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Magazine;
