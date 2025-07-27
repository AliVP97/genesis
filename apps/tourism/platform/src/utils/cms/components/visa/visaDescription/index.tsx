import { FC } from 'react';
import { VisaDescriptionProps } from './types';
import parse from 'html-react-parser';

const VisaDescription: FC<VisaDescriptionProps> = ({ content }) => {
  return (
    <div dir="rtl" className="my-4">
      {parse(content ?? '')}
    </div>
  );
};

export default VisaDescription;
