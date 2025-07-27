import { useEffect, useRef } from 'react';
import styles from '../availableDate.module.scss';

// this useEffect is set just for dragging and drop
export default function useDragging(element: HTMLDivElement | null) {
  const isDragging = useRef(false);

  useEffect(() => {
    if (!element) return;

    let startX: number;
    let scrollLeft: number;
    let isDown = false;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      isDragging.current = false; // Reset the dragging flag
      element.classList.add(styles.dragging);
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      element.classList.remove(styles.dragging);
    };

    const onMouseUp = () => {
      isDown = false;
      element.classList.remove(styles.dragging);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) {
        return;
      }

      isDragging.current = true; // Set the dragging flag to true when dragging occurs
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = x - startX; // Normal scroll speed
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mousemove', onMouseMove);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mousemove', onMouseMove);
    };
  }, [element]);

  // this useEffect is set not to click when drop happens after dragging
  useEffect(() => {
    if (!element) {
      return;
    }

    const onClick = (e: MouseEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = false; // Reset dragging flag after preventing click
      }
    };

    element.addEventListener('click', onClick, true); // Use capture phase

    return () => {
      element.removeEventListener('click', onClick, true);
    };
  }, [element]);
}
