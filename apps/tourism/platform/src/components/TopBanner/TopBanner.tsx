import styles from './TopBanner.module.scss';

export const TopBanner = () => (
  <a
    href={`${process.env.NEXT_PUBLIC_DOMAIN}tourism/train`}
    className={styles['container']}
    dir="rtl"
  >
    <span>زمان‌بندی آغاز پیش‌فروش بلیط قطارهای نوروزی</span>
    <span>
      ۸ صبح چهارشنبه ۹ اسفند: کلیه مسیرهای منتهی به مشهد، به غیر از تهران به مشهد و بالعکس
    </span>
    <span>۸ صبح پنجشنبه ۱۰ اسفند: قطارهای تهران به مشهد و بالعکس</span>
  </a>
);
