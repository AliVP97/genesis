import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { z } from 'zod';

import { paymentBanner } from 'services/general/payment';

import styles from './paymentBanner.module.scss';

const paymentBannerSchema = z
  .array(
    z.object({
      image: z.string(),
      link: z.string(),
    }),
  )
  .min(1);

const PaymentBanner = () => {
  const { data } = useQuery(['paymentBanner'], paymentBanner, { staleTime: Infinity });
  const paymentData = paymentBannerSchema.safeParse(data).data;

  if (!paymentData) {
    return null;
  }

  return (
    <div className={styles.payment__banner}>
      <Link href={paymentData[0].link} passHref legacyBehavior>
        <a>
          <Image
            src={paymentData[0].image}
            alt="780 Payment-Banner"
            width={500}
            height={100}
            priority
          />
        </a>
      </Link>
    </div>
  );
};
export default PaymentBanner;
