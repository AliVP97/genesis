import { FC } from 'react';
import { SupportBodyProps } from './types';
import style from '../style.module.scss';
import Image from 'next/image';

const SupportBody: FC<SupportBodyProps> = ({ description, contactMethods }) => {
  return (
    <div className={style.body}>
      <p className={style.body__description}>{description}</p>
      <div className="d-flex flex-column gap-2">
        {contactMethods?.map((item) => {
          return (
            <div key={item?.id} className={style['body__contact-methods']}>
              <div className="d-flex align-items-center gap-3">
                <Image src={item.icon.url} alt="contact methods icon" width={24} height={24} />
                <span className={style['body__contact-methods__title']}>{item.title}</span>
              </div>
              <a className={style['body__contact-methods__link']} href={item.link}>
                {item.linkText}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportBody;
