import cn from 'classnames';
import styles from './progressBar.module.scss';
type ProgressBarProps = {
  percent: number | undefined;
  customClass?: string;
};
const ProgressBar = ({ percent, customClass }: ProgressBarProps) => {
  const progressClass = {
    width: percent + '%',
  };
  return (
    <>
      <div className={cn('progress', styles['progress-bar'])}>
        <div className={`progress-bar ${customClass}`} style={progressClass}></div>
      </div>
    </>
  );
};

export default ProgressBar;
