import styles from '../style.module.scss';
import { SupplierItemProps } from '../types';
import Image from 'next/image';

function Supplier({ item }: { item: SupplierItemProps }) {
  const Content = () => (
    <div className={styles.companies__item}>
      <Image
        src={item.image?.url ?? ' http://780.ir'}
        alt={item.title ?? 'Supplier logo'}
        width={48}
        height={48}
      />
      <div>
        <span>{item?.title}</span>
      </div>
    </div>
  );

  return item.link ? (
    <a
      href={item.link}
      className="text-decoration-none color-on-surface"
      aria-label={`Link to ${item.title}`}
    >
      <Content />
    </a>
  ) : (
    <div>
      <Content />
    </div>
  );
}

export default Supplier;
