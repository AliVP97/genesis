import { Main } from './components/main';
import { useWeb } from 'utils/hooks/useWeb';
import packageData from '../../../../package.json';
import styles from './components/main/footer.module.scss';
import cn from 'classnames';

const Footer = () => {
  const isWeb = useWeb();
  return isWeb ? (
    <>
      <div className="bg-color-primary pt-2">
        <div className="container-xxl">
          <Main />
        </div>
      </div>
      <div className="d-flex flex-column flex-lg-row-reverse justify-content-center text-white gap-0 gap-lg-2 text-2 py-3 text-center bg-color-primary-surface-fixed">
        <span>{'.کلیه حقوق این وب سایت محفوظ و متعلق به شرکت تهران اینترنت می‌باشد'}</span>
        <span className={cn(styles['footer__version'], 'mt-2 mt-lg-0')}>
          ورژن {packageData.version}
        </span>
      </div>
    </>
  ) : null;
};

export default Footer;
