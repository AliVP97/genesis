import styles from './countdown.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

export enum TimerProps {
  SECOND = 'SECOND',
  MINUTES = 'MINUTES',
}

interface Props {
  duration: number;
  resetTime: boolean;
  onFinish: () => void;
  type?: TimerProps;
  wrapperClassName?: string;
  numberClassName?: string;
}

const Countdown: FC<Props> = ({
  duration = 120,
  resetTime,
  onFinish,
  type = TimerProps.SECOND,
  wrapperClassName,
  numberClassName,
}) => {
  const [time, setTime] = useState(duration);
  const interval = useRef<ReturnType<typeof setInterval> | number>(duration);

  const filterTime = (n: string | number, width = 2) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  };

  const timeInterval = () => {
    interval.current = setInterval(() => {
      setTime((prevState) => prevState - 1);
    }, 1000);
  };

  useEffect(() => {
    timeInterval();

    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
    };
  }, []);

  useEffect(() => {
    if (time <= 0) {
      onFinish();
      clearInterval(interval.current as NodeJS.Timeout);
    }
  }, [onFinish, time]);

  useEffect(() => {
    if (resetTime) {
      setTime(duration);
      timeInterval();
    }

    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
    };
  }, [duration, resetTime]);

  return (
    <div
      className={cn(
        styles.countdown,
        `${time < 10 ? styles['countdown--error'] : styles['countdown--pending']}`,
        wrapperClassName,
      )}
    >
      <div className={cn(styles.countdown__number, numberClassName)}>
        {type === TimerProps.SECOND ? (
          <span>{time}</span>
        ) : (
          <>
            <span>{filterTime(time % 60)}</span>:<span>{filterTime(Math.floor(time / 60))}</span>
          </>
        )}
      </div>
      {type === TimerProps.SECOND && (
        <svg>
          <circle style={{ animationDuration: `${duration}s` }} r="14" cx="16" cy="16" />
        </svg>
      )}
    </div>
  );
};

export default Countdown;
