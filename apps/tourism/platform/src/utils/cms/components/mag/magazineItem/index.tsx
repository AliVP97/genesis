import Image from 'next/image';
import styles from '../style.module.scss';
import { MagItemProps } from '../types';
import parse from 'html-react-parser';

function MagItem({ data }: { data: MagItemProps }) {
  return (
    <div>
      <div className={styles.magazine__item}>
        <a
          href={data?.link}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none color-on-surface"
        >
          {data?.image && (
            <Image
              className="rounded-5"
              layout="fixed"
              objectFit="cover"
              src={data?.image?.url}
              alt=""
              width="278"
              height="318"
            />
          )}
          <div className={styles.magazine__item__footer}>
            <span>{data?.title}</span>
            {data.body && <p>{parse(data?.body)}</p>}
          </div>
        </a>
      </div>
    </div>
  );
}

export default MagItem;
