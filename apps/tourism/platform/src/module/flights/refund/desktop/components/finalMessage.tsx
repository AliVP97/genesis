import React from 'react';
import style from './style.module.scss';

export const FinalMessage: React.FunctionComponent<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  return (
    <div className="px-3 ">
      <p className="rtl">{message}</p>
      <div
        className={style['btn']}
        onClick={() => {
          onClose();
        }}
      >
        متوجه شدم
      </div>
    </div>
  );
};
