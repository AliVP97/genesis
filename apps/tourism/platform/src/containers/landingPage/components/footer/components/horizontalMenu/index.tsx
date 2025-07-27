import cn from 'classnames';
import Divider from 'components/divider';
import styles from './horizontalMenu.module.scss';

const HorizontalMenu = () => {
  return (
    <>
      <ul className={cn(styles['horizotal-menu'])}>
        <li>
          <a href={`${process.env.NEXT_PUBLIC_DOMAIN}about-us`}>
            <small className="color-white">درباره ما</small>
          </a>
        </li>
        <li>
          <Divider type="vertical" style="normal" className="bg-color-grey-16 h-100" />
        </li>
        <li>
          <a href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}>
            <small className="color-white">قوانین و مقررات عمومی گردشگری</small>
          </a>
        </li>
        <li>
          <Divider type="vertical" style="normal" className="bg-color-grey-16 h-100" />
        </li>
        <li>
          <a href={`${process.env.NEXT_PUBLIC_DOMAIN}page/privacy`}>
            <small className="color-white">سیاست نامه حریم خصوصی</small>
          </a>
        </li>
      </ul>
    </>
  );
};

export default HorizontalMenu;
