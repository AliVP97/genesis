import { FC, ReactNode } from 'react';

import cn from 'classnames';

import { BackArrowIcon, CloseIcon } from 'assets/icons';

import styles from '../Refund.module.scss';

type THeaderProps = {
  isMobile: boolean;
  handleBack: () => void;
  handleClose: () => void;
  children: ReactNode;
};

export const Header: FC<THeaderProps> = ({ isMobile, handleBack, handleClose, children }) =>
  isMobile ? (
    <div className={cn(styles.refund__header, 'border-bottom')}>
      <BackArrowIcon
        onClick={handleBack}
        className={cn(styles['refund__header--icon'], 'fill-tertiary')}
      />
      <span className="text-3 text-weight-500">{children}</span>
    </div>
  ) : (
    <div className="d-flex flex-row justify-content-between align-items-center px-3 py-3 border-bottom">
      <div className="d-flex flex-row ">
        <div className="me-1">
          <span className="color-on-surface text-weight-500">{children}</span>
        </div>
      </div>
      <CloseIcon onClick={handleClose} />
    </div>
  );
