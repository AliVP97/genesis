import Button from 'components/button';

import styles from './footer.module.scss';

import { useRouter } from 'next/router';

type TFooterProps = {
  handleClick: () => void;
  isLoading: boolean;
};

const Footer = ({ handleClick, isLoading }: TFooterProps) => {
  const router = useRouter();
  return (
    <div>
      <div className={styles.footer}>
        <Button
          radius
          btnType="submit"
          className="btn btn-primary d-block px-5"
          onClick={handleClick}
          loading={isLoading}
        >
          تایید و ادامه
        </Button>
        <button
          className="btn btn-outline-secondary d-block px-5 rounded ms-3"
          onClick={() => {
            router.back();
          }}
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default Footer;
