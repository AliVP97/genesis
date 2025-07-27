import cn from 'classnames';
import React from 'react';
import styles from './style.module.scss';
import PrepositionItem from './prepositionItem';
import { PrepositionProps } from './types';

const Preposition = ({ items }: PrepositionProps) => {
  return (
    <div dir="rtl" className="my-4">
      <div className={cn(styles.services)}>
        <div className="row justify-content-center">
          {items?.map((item) => {
            return (
              <>
                <div className={cn(styles['services__each-item'], 'col-6 col-md-3')}>
                  <div>
                    <PrepositionItem title={item.title} body={item.body} image={item.image} />
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Preposition;
