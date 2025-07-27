import styles from './error.module.scss';
import cn from 'classnames';

export const ComponentError = () => {
  return (
    <div className={cn('d-flex flex-column align-items-center', styles.errorContainer)}>
      {' '}
      <div className={cn('w-100', styles.shimmerBox, styles.errorHeaderContainer)} />
      <div className={cn('w-100', styles.shimmerBox, styles.errorBodyContainer)} />
    </div>
  );
};
