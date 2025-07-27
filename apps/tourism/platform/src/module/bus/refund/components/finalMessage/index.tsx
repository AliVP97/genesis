import { useRouter } from 'next/router';
import React from 'react';
import style from './style.module.scss';
function FinalMessage({ message }: { message: string }) {
  const { push } = useRouter();
  return (
    <>
      <div className="px-3 ">
        <p className="rtl">{message}</p>
        <div className={style['btn']} onClick={() => push('/')}>
          متوجه شدم
        </div>
      </div>
    </>
  );
}

export default FinalMessage;
