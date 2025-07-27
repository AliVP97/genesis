import { FC } from 'react';
import { VisaExplanationProps } from './types';
import parse from 'html-react-parser';
import Image from 'next/image';

const VisaExplanation: FC<VisaExplanationProps> = ({ title, body, image }) => {
  return (
    <div>
      <div dir="rtl" className="my-4 text-justify">
        <h2 className="fs-5 fw-500">{title}</h2>
        <div className="row flex-column-reverse flex-lg-row mt-3">
          <div className="col-md-12 col-lg-6">{parse(body ?? '')}</div>
          {image?.url && (
            <div className="col-md-12 col-lg-6">
              <Image className="rounded-3" width={2117} height={1576} src={image?.url} alt="visa" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaExplanation;
