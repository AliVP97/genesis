import cn from 'classnames';
import React from 'react';
import LicenseItem from './components/licenceItem';
import styles from './license.module.scss';
import { Licenses } from './type';

const License = () => {
  return (
    <>
      <div className={cn(styles['license'])}>
        {React.Children.toArray(
          Licenses.map((item, index) => {
            return (
              <>
                <LicenseItem
                  key={index.toString() + item.title}
                  src={item.src}
                  title={item.title}
                  link={item.link}
                />
              </>
            );
          }),
        )}
      </div>
    </>
  );
};

export default License;
