import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { GATEWAYS_ICONS } from './DynamicGateways.constants';
import { TGateway } from './DynamicGateways.types';

import styles from './styles.module.scss';
import { SnappPayIcon } from 'assets/icons';
import { SNAPP_PAYMENT_ID } from 'components/PaymentBottomSheet/utils/constants/globalConstants';

type TDynamicGateWaysProps = {
  gateways: TGateway[] | undefined;
  defaultGateway?: number;
  selectGateway: (gatewayId: number) => void;
  wrapperClassNames?: string;
};

export const DynamicGateways: FC<TDynamicGateWaysProps> = ({
  gateways,
  defaultGateway = gateways?.[0].id,
  selectGateway,
  wrapperClassNames,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<number>();

  const onChangeHandler = (gateway: TGateway) => {
    setSelectedGateway(gateway.id);
    selectGateway(gateway.id);
  };

  useEffect(() => {
    if (defaultGateway) {
      setSelectedGateway(defaultGateway);
      selectGateway(defaultGateway);
    }
  }, [defaultGateway]);

  return (
    <div className={classNames(styles.container, wrapperClassNames)}>
      {gateways?.map((item) => {
        const isSelected = item.id === selectedGateway;
        const isChecked = item.id === defaultGateway;
        const gatewayIcon =
          item.id === SNAPP_PAYMENT_ID ? (
            <SnappPayIcon />
          ) : (
            GATEWAYS_ICONS?.[item.paymentMethod]?.icon
          );
        return (
          <>
            <label
              htmlFor={`payemnt-gateway-${item.id}`}
              key={item.id}
              className={classNames(styles.gateway, isSelected && styles['--active'])}
            >
              <div className={styles.icon}>{gatewayIcon}</div>
              <div className={classNames(styles.context)}>
                <div>
                  <span>{item.name}</span>
                  <div>
                    {item.paymentMethod === 'wallet' ? (
                      <span className={styles.label}>
                        موجودی: {item.balance?.length ? item.balance : 0} <br />{' '}
                        {item.expireDate?.length ? `انقضاء: ${item.expireDate}` : null}
                      </span>
                    ) : (
                      <span className={styles.label}>{item.label}</span>
                    )}
                  </div>
                </div>
              </div>
              <input
                id={`payemnt-gateway-${item.id}`}
                type="radio"
                name="paymentGateway"
                value={item.id}
                defaultChecked={isChecked}
                onChange={() => onChangeHandler(item)}
              />
            </label>
            <div
              className={`${styles['gateway-message']} ${item.toast && selectedGateway === item.id ? styles.open : ''}`}
            >
              <span>{item.toast}</span>
            </div>
          </>
        );
      })}
    </div>
  );
};
