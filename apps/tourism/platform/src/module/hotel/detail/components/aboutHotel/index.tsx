import { ArrowLeftPrimaryColor } from 'assets/icons';
import React, { useState } from 'react';
import styles from './aboutHotel.module.scss';
import cn from 'classnames';
import { breakLines } from 'utils/helpers/breakLines';
import { getTextDirection } from 'utils/helpers/textDirection';
interface AboutHotelProps {
  aboutText: string;
}

const AboutHotel = ({ aboutText }: AboutHotelProps) => {
  const [showAllAbout, setShowAllAbout] = useState(false);
  const textDirection = getTextDirection(aboutText);
  return (
    <>
      <div className="col-3"></div>
      <div className="col-9">
        <div className="d-flex mt-3">
          {!showAllAbout && (
            <div
              onClick={() => {
                setShowAllAbout(!showAllAbout);
              }}
              className="d-flex col-6 align-items-center cursor-pointer color-primary"
            >
              <ArrowLeftPrimaryColor />
              <div className="ps-2">مشاهده کامل متن</div>
            </div>
          )}
          <div
            className={cn(
              'd-flex justify-content-end w-100 text-black color-black text-weight-500 text-5 mb-2',
            )}
          >
            درباره هتل
          </div>
        </div>
        <div className={`card p-5 text-3 rounded-2 `}>
          <p className={cn(showAllAbout ? '' : styles['truncate-text'])} dir={textDirection}>
            {breakLines(aboutText)}
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutHotel;
