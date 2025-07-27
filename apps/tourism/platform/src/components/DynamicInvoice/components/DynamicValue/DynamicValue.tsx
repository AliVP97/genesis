import { FC } from 'react';
import cn from 'classnames';
import { definitions } from 'types/payment';
import styles from './style.module.scss';
import { CopyOutline } from 'assets/icons';
import { copyToClipboard } from 'utils/helpers/copyToClipboard';

const colorMapper: Record<string, string> = {
  total_price: '#065BAA',
};

type TDynamicValueProps = {
  data: definitions['paymentBreakdownItem'];
};

export const DynamicValue: FC<TDynamicValueProps> = ({ data }) => {
  return (
    <div
      style={{
        color:
          data.valueColor && colorMapper?.[data.valueColor]
            ? colorMapper[data.valueColor]
            : 'initial',
      }}
      className={cn(styles.value__container, data.valueIsBold && styles.isBold)}
    >
      {data.valueCopiable && (
        <div onClick={() => copyToClipboard(data.value ?? '')}>
          <CopyOutline class={cn('copy-icon', styles.copyValue)} />
        </div>
      )}
      <span className={styles.value}>
        {data.valuePrefix} {data.value} {data.valueSuffix}
      </span>
      {data.valueIcon && ( // eslint-disable-next-line @next/next/no-img-element
        <img width={24} height={24} src={data.valueIcon} alt="icon" />
      )}
    </div>
  );
};
