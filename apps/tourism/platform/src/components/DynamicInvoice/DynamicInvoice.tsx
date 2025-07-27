import { FC } from 'react';

import { DynamicRow } from './components';
import { definitions } from 'types/payment';

import styles from './style.module.scss';
import classNames from 'classnames';

type TDynamicInvoiceProps = {
  sections: definitions['paymentOrderReceiptResponse']['sections'];
  hasRowSeparator?: boolean;
};

export const DynamicInvoice: FC<TDynamicInvoiceProps> = ({ sections, hasRowSeparator = false }) => {
  return (
    <>
      {sections?.map((section, sectionIndex) => (
        <div key={section.id}>
          {section?.items?.map((item, rowIndex) => (
            <div key={item.id}>
              <DynamicRow data={item} />
              {section?.items?.length && rowIndex < section?.items?.length - 1 && (
                <hr
                  className={classNames(
                    styles['row-separator'],
                    hasRowSeparator && styles['--visible'],
                  )}
                />
              )}
            </div>
          ))}
          {sectionIndex < sections.length - 1 && <hr className={styles['separator']} />}
        </div>
      ))}
    </>
  );
};
