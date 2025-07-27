import { FC } from 'react';
import { SupportFooterProps } from './types';
import style from '../style.module.scss';
import cn from 'classnames';
import Button from 'components/button';
import { useRouter } from 'next/router';
import Image from 'next/image';

const SupportFooter: FC<SupportFooterProps> = ({ buttonList }) => {
  const { push } = useRouter();
  return (
    <div className={style.footer}>
      {buttonList?.map((item) => {
        return (
          <div key={item?.id} className="d-flex flex-column">
            <Button
              className={cn(
                style.footer__button,
                item.type === 'primary'
                  ? style.footer__button__primary
                  : style.footer__button__secondary,
              )}
              onClick={() => {
                push(item?.link);
              }}
            >
              <Image src={item?.icon?.url} alt="chat icon" width={18} height={18} />
              <span>{item?.title}</span>
            </Button>
            {item?.caption && <span className={style.footer__caption}>{item?.caption}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default SupportFooter;
