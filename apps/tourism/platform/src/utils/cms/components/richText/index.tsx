import { useState } from 'react';
import Image from 'next/image';
import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import parse from 'html-react-parser';
import style from './style.module.scss';
import { RichTextPropsType } from './types';

const RichTextComponent = (cmdData: RichTextPropsType) => {
  const [moreIsVisible, setMoreIsVisible] = useState(false);
  const { title, body, summary, image } = cmdData || {};

  const handleReadMoreClick = () => {
    setMoreIsVisible(!moreIsVisible);
  };
  return (
    <div className="my-4">
      <div className={style.main}>
        <div className="container d-flex justify-content-center align-items-start flex-column px-md-5">
          <div className={style.intro}>
            <h1 className={style.title}>{title}</h1>
            <div className={style.image}>
              <Image
                src={image?.url ?? 'http://780.ir'}
                alt={title}
                layout="responsive"
                objectFit="fill"
                width={384}
                height={215}
              />
            </div>
            <div className={style.text}>{parse(summary || '')}</div>
          </div>
          <div className={`${style.more} ${!moreIsVisible ? style.invisible : ''}`}>
            {parse(body ?? '')}
          </div>
          <button className={style['toggle-button']} onClick={handleReadMoreClick}>
            {moreIsVisible ? (
              <>
                بستن متن
                <ArrowUpIcon />
              </>
            ) : (
              <>
                مشاهده تمام متن <ArrowDownIcon />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default RichTextComponent;
