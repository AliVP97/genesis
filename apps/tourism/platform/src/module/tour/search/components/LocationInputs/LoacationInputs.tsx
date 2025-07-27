import { FC } from 'react';

import { TType } from 'services/tour/v2';

import DesktopLocationInput from './DesktopLocationInput';
import { TLocationType } from '../../types';
import MobileLocationInput from './MobileLocationInput';
type TLocationInputsProps = {
  tourType: TType;
  onSubmit: (state: TLocationType) => void;
};

export const LocationInputs: FC<TLocationInputsProps> = ({ tourType, onSubmit }) => {
  return (
    <>
      <div dir={'rtl'} className="d-block d-md-none">
        <MobileLocationInput tourType={tourType} onSubmit={onSubmit} />
      </div>
      <div className="d-none d-md-block">
        <DesktopLocationInput tourType={tourType} onSubmit={onSubmit} />
      </div>
    </>
  );
};
