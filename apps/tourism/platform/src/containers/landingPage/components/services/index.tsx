import cn from 'classnames';
import React from 'react';
import { ServiceItems } from 'containers/landingPage/data';
import ServicesItem from './servicesItem';
import styles from './services.module.scss';

const Services = () => {
  return (
    <>
      <div className={cn(styles['services'])}>
        <div className="row justify-content-center">
          {React.Children.toArray(
            ServiceItems?.map((item) => {
              return (
                <>
                  <div className={cn(styles['services__each-item'], 'col-6 col-md-3')}>
                    <div>
                      <ServicesItem
                        title={item.title}
                        description={item.description}
                        image={item.image}
                      />
                    </div>
                  </div>
                </>
              );
            }),
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
