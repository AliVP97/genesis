import { FC } from 'react';
import { VisaConditionsItemProps } from '../visaConditions/types';
import Image from 'next/image';

const VisaConditionsItem: FC<VisaConditionsItemProps> = ({ title, description, image }) => {
  return (
    <div className="d-flex flex-row flex-nowrap align-items-start align-items-md-center gap-2 my-3">
      <div
        style={{ minWidth: 48, minHeight: 48 }}
        className="d-flex justify-content-center align-items-center rounded-4 bg-color-surface-container"
      >
        <Image src={image?.url} alt="visa conditions icon" width={36} height={36} />
      </div>
      <div className="d-flex flex-column ms-3">
        <span className="fs-3 fw-lg-bold fw-500 color-on-surface">{title}</span>
        {description && (
          <span className="fs-3 text-justify color-on-surface-var text-wrap">{description}</span>
        )}
      </div>
    </div>
  );
};

export default VisaConditionsItem;
