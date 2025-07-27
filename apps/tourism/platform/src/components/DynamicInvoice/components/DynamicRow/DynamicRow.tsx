import { FC, useState } from 'react';
import cn from 'classnames';
import { copyToClipboard } from 'utils/helpers/copyToClipboard';
import { definitions } from 'types/payment';
import { ArrowDownIcon, CopyOutline } from 'assets/icons';

import styles from './style.module.scss';

type TDynamicProps = {
  data: definitions['paymentBreakdownItem'];
};

const colorMapper: Record<string, string> = {
  total_price: '#065BAA',
};

export const DynamicRow: FC<TDynamicProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(styles.row, data?.labelDescription && styles['--has-description'])}>
      <div
        className={cn(styles.right_item)}
        onClick={() => {
          if (data?.labelDescription) setIsExpanded(!isExpanded);
        }}
      >
        <span className={styles.label}>{data?.label}</span>
        {data?.labelDescription && (
          <ArrowDownIcon
            className={cn(styles.chevron, isExpanded && styles['--expanded'])}
            data-html2canvas-ignore="true"
          />
        )}
        {isExpanded && <div className={styles['label-description']}>{data?.labelDescription}</div>}
      </div>
      {/* <DynamicValue data={data} /> */}
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
    </div>
  );
};
