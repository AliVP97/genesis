import { ArrowLeftPrimaryColor } from 'assets/icons';
import styles from '../style.module.scss';

function Header({ title }: { title?: string }) {
  return (
    <>
      <div className={styles.magazine__header}>
        <span>{title ?? 'مجله هف‌هشتاد'}</span>
        <div>
          <a
            className="ps-3 cursor-pointer text-decoration-none"
            href={`${process.env.NEXT_PUBLIC_DOMAIN_URL}mag/`}
            target="_blank"
            rel="noreferrer"
          >
            مشاهده مجله هف‌هشتاد
          </a>
          <ArrowLeftPrimaryColor />
        </div>
      </div>
    </>
  );
}

export default Header;
