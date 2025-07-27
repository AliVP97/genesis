import { LoginBrownIcon } from 'assets/icons';
import cn from 'classnames';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import styles from './loginWarning.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const LoginWarning = () => {
  const { setLoginModalVisible } = useAuthContext();
  const { isMobile } = useDeviceDetect();

  return (
    <>
      <div className={cn(!isMobile && 'd-flex justify-content-between', styles['login-warning'])}>
        <div>
          <span className="ps-2">
            <LoginBrownIcon />
          </span>
          <span className={cn(isMobile && 'text-2')}>
            برای انتخاب مسافران از لیست مسافران خود لاگین نمایید.
          </span>
        </div>
        <div className={cn(isMobile && 'text-2 d-flex justify-content-end')}>
          <button onClick={() => setLoginModalVisible(true)}>لیست مسافران</button>
        </div>
      </div>
    </>
  );
};

export default LoginWarning;
