import Header from 'components/header';
import { ReactNode } from 'react';

export const BlankLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="home">
      <Header />
      <div className="container">
        <div className="row">{children}</div>
      </div>
    </div>
  );
};
