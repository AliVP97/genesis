import { FC } from 'react';
import classNames from 'classnames';

import RadioElement from 'components/radio';
import { TType } from 'services/tour/v2';

import styles from './TypeSwitch.module.scss';

interface Props {
  type: TType;
  onChange: (type: TType) => void;
}

export const TypeSwitch: FC<Props> = ({ type, onChange }) => {
  return (
    <>
      <div className={classNames(styles['ticket-type'], 'd-flex d-md-none')}>
        <div
          className={classNames(
            styles['ticket-type__button'],
            type === 'INTERNATIONAL' && styles['ticket-type__button--active'],
          )}
          onClick={() => onChange('INTERNATIONAL')}
        >
          تور خارجی
        </div>
        <div
          className={classNames(
            styles['ticket-type__button'],
            type === 'DOMESTIC' && styles['ticket-type__button--active'],
          )}
          onClick={() => onChange('DOMESTIC')}
        >
          تور داخلی
        </div>
      </div>
      <div className="d-none d-md-flex flex-row-reverse">
        <div className="hover" role={'button'}>
          <RadioElement
            className="rtl"
            checked={type === 'DOMESTIC'}
            label="تور داخلی"
            onChange={() => onChange('DOMESTIC')}
            value="oneWay"
          />
        </div>
        <div className="px-4 hover" role={'button'}>
          <RadioElement
            className="rtl"
            checked={type === 'INTERNATIONAL'}
            label="تور خارجی"
            onChange={() => onChange('INTERNATIONAL')}
            value="INTERNATIONAL"
          />
        </div>
      </div>
    </>
  );
};
