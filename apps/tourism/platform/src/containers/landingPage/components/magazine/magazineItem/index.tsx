import { IMagazine } from 'containers/landingPage/types';
import Image from 'next/image';
import styles from '../magazine.module.scss';

type MagazineItemPropsType = {
  magazine: IMagazine;
};

function MagazineItem({ magazine }: MagazineItemPropsType) {
  return (
    <div>
      <div className={styles['magazine__item']}>
        <a
          href={magazine?.path}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none color-on-surface"
        >
          {!!magazine.src && (
            <Image
              className="rounded-5"
              layout="fixed"
              objectFit="cover"
              src={magazine.src}
              alt=""
              width="278"
              height="318"
            />
          )}
          <div className={styles['magazine__item__footer']}>
            <span>{magazine.title}</span>
            <p>{magazine.description}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default MagazineItem;
