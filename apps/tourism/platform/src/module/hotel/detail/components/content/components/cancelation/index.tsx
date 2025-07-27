import { ArrowLeftPrimaryColor } from 'assets/icons';
import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';

import CancelationRules from './CanelationRules';
export type TCancelationRules = {
  penalty?: string;
  text?: string;
}[];
type THotelAbout = {
  cancelationRules: TCancelationRules;
  title: string;
  icon: React.ReactNode;
};
const CancelationInfoBox = ({ cancelationRules, icon, title }: THotelAbout) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <div className="rtl">
        <h6 className="text-end mb-3">
          {icon}
          <span className="pe-1"> {title} </span>
        </h6>
        {cancelationRules && <CancelationRules rules={cancelationRules.slice(0, 3)} />}
        {/* <span className="text-justify">{text?.substring(0, 150)}</span> */}
        <div
          className="mt-3 d-flex align-items-center justify-content-end"
          onClick={() => setShow(true)}
        >
          <span className="ps-3 color-primary">مشاهده تمام متن</span>
          <ArrowLeftPrimaryColor />
        </div>
      </div>
      <BottomSheet
        open={show}
        onDismiss={() => setShow(false)}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.5}
      >
        <div className="px-2 pt-3 text-end px-4">
          <h6 className="text-center pb-2">{title}</h6>
          {cancelationRules && <CancelationRules rules={cancelationRules} />}
        </div>
      </BottomSheet>
    </>
  );
};

export default CancelationInfoBox;
