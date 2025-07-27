import Divider from 'components/divider';
import { FC } from 'react';

const DesktopModalFooter: FC = ({ children }) => (
  <div className="mt-auto d-flex flex-column">
    <Divider type="horizontal" />
    <div className="p-3 me-auto">{children}</div>
  </div>
);

export default DesktopModalFooter;
