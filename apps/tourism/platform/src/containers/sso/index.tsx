import Spinner from 'components/spinner';
import useLoginSSO from './hooks/useLoginSSO';
import { TLoginSSo } from 'pages/login/sso';

type LoginContainerProps = {
  SSOHeaderInfo: TLoginSSo;
};

const LoginSSOContainer = ({ SSOHeaderInfo }: LoginContainerProps) => {
  useLoginSSO(SSOHeaderInfo);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Spinner fontSize="8px" />
    </div>
  );
};
export default LoginSSOContainer;
