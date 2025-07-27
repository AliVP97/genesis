import Image from 'next/image';
import React, { FC } from 'react';
import { VisaValidityPeriodProps } from './types';
import parse from 'html-react-parser';

const VisaValidityPeriod: FC<VisaValidityPeriodProps> = ({ title, description, image }) => {
  return (
    <div dir="rtl" className="bg-color-surface-container my-4 px-4 py-3 rounded-4">
      <h2 className="fs-5 fw-500">{title}</h2>
      <div className="mt-3 d-flex justify-content-center">
        <Image className="rounded-3" width={904} height={472} src={image?.url ?? ''} alt="visa" />
      </div>
      {description && <p className="mt-3 text-justify">{parse(description)}</p>}
    </div>
  );
};

export default VisaValidityPeriod;
