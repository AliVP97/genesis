import styles from './availableDate.module.scss';
import { BackwardIcon, ForwardIcon } from '../../assets/icons';
import { DESKTOP_SLIDE_SIZE } from './utils/resources';

type Direction = 'start' | 'end';

interface NavigateToProps {
  direction: Direction;
  container: HTMLDivElement | null;
}

function navigateTo(container: HTMLDivElement, direction: 'start' | 'end') {
  const x = Number(container.scrollLeft) + 1;

  if (direction === 'start') {
    container.scrollTo({
      top: 0,
      left: x + DESKTOP_SLIDE_SIZE,
      behavior: 'smooth',
    });
  } else {
    container.scrollTo({
      top: 0,
      left: x - DESKTOP_SLIDE_SIZE,
      behavior: 'smooth',
    });
  }
}

export default function Navigator({ direction, container }: NavigateToProps) {
  function handleClick() {
    if (!container) {
      return;
    }

    navigateTo(container, direction);
  }

  return (
    <div onClick={handleClick} className={styles['resultDate_icon']}>
      {direction === 'start' ? <ForwardIcon /> : <BackwardIcon />}
    </div>
  );
}
