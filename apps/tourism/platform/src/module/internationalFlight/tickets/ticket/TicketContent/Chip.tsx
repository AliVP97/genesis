import styles from './Chip.module.scss';
import { forwardRef, ReactNode } from 'react';
import cn from 'classnames';

type Variation = 'normal' | 'warning' | 'highlight';

interface ChipProps {
  variation: Variation;
  children: ReactNode;
}

function getClassName(variation: Variation) {
  const classNames = ['d-flex align-items-center p-1 ps-md-3 pe-md-3 text-center', styles.root];

  if (variation === 'warning') {
    classNames.push(styles['warning']);
  } else if (variation === 'highlight') {
    classNames.push(styles['highlight']);
  } else if (variation === 'normal') {
    classNames.push(styles['normal']);
  }

  return cn(classNames);
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(({ children, variation }, ref) => (
  <div ref={ref} className={getClassName(variation)}>
    {children}
  </div>
));

Chip.displayName = 'Chip';

export default Chip;
