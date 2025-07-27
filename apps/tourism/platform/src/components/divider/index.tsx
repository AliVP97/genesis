import { FC } from 'react';
import cn from 'classnames';
import styles from './divider.module.scss';

interface DividerProps {
  type: 'vertical' | 'horizontal';
  className?: string;
  style?: 'normal' | 'dashed';
}

const Divider: FC<DividerProps> = ({ type, style, className }) => {
  const checkProps = () => {
    if (style === 'normal') {
      if (type === 'vertical') return styles['divider__vertical'];
      else return styles['divider__horizontal'];
    } else {
      if (type === 'vertical')
        return cn(styles['divider__vertical'], styles['divider__vertical--dashed']);
      else return cn(styles['divider__horizontal'], styles['divider__horizontal--dashed']);
    }
  };
  return <div className={cn(checkProps(), className)} />;
};

Divider.defaultProps = {
  style: 'normal',
};

export default Divider;
