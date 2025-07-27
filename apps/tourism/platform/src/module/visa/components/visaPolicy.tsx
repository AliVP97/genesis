import { FC } from 'react';
import { CalendarIcon } from 'assets/icons';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type TProps = {
  title: string;
  content?: string;
};

const VisaPolicy: FC<TProps> = ({ title, content }) => {
  const { isMobile } = useDeviceDetect();
  return (
    <div className={isMobile ? 'd-flex align-items-start my-3' : 'd-flex align-items-center my-3'}>
      <div className="rounded-5 bg-color-surface-container p-2">
        <CalendarIcon />
      </div>
      <div className="d-flex flex-column">
        <span className="fs-3 fw-lg-bold fw-500 pe-3 color-on-surface">{title}</span>
        <span className="fs-3 pe-3 text-justify color-on-surface-var">{content}</span>
      </div>
    </div>
  );
};
export default VisaPolicy;
