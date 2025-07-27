import { ArrowLeftPrimaryColor } from 'assets/icons';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { breakLines } from 'utils/helpers/breakLines';
import { getTextDirection } from 'utils/helpers/textDirection';

type THotelAbout = {
  text: string | undefined;
  title: string;
  icon: React.ReactNode;
};
const HotelInfoBox = ({ text, icon, title }: THotelAbout) => {
  const [show, setShow] = useState<boolean>(false);
  const platform = useRef<string | null>(null);
  useEffect(() => {
    platform.current = sessionStorage.getItem('platform');
  }, []);

  const textDirection = getTextDirection(text ?? '');

  return (
    <>
      <div className="" style={platform.current === 'superapp' ? { paddingBottom: '4rem' } : {}}>
        <h6 className="text-end mb-3">
          {icon}
          <span className="pe-1"> {title} </span>
        </h6>
        {text && <div dir={textDirection}>{breakLines(text?.substring(0, 150))}</div>}

        <div className="mt-3 d-flex align-items-center " onClick={() => setShow(true)}>
          <ArrowLeftPrimaryColor />
          <span className="ps-3 color-primary">مشاهده تمام متن</span>
        </div>
      </div>
      <BottomSheet
        open={show}
        onDismiss={() => setShow(false)}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.5}
      >
        <div className="px-2 pt-3 px-4">
          <h6 className="text-center pb-2">{title}</h6>
          {text && <div dir={textDirection}>{breakLines(text)}</div>}
        </div>
      </BottomSheet>
    </>
  );
};

export default HotelInfoBox;
