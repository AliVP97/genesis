import { Phone, Pin } from 'assets/icons';

import cn from 'classnames';

import License from '../license';
import styles from './contactInfo.module.scss';
import Link from 'next/link';
import { HAFHASHTAD_TEL } from 'utils/static/global';
const ContactInfo = () => {
  return (
    <>
      <div
        className={cn(
          styles['contact-info'],
          'd-flex flex-column  align-items-center flex-md-row justify-content-md-between',
        )}
      >
        <div className="text-white mb-2">
          <div className="d-flex align-items-center text-center">
            <div className="d-none d-md-block ps-2">
              <Pin />
            </div>
            <span>آدرس دفتر مرکزي: تهران - خيابان جمهوري - تقاطع اسکندري جنوبي - ساختمان 510</span>
          </div>
          <div className="pt-2">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <Link href={`tel:${HAFHASHTAD_TEL}`}>
                <a
                  className={
                    'd-lg-flex align-items-center text-center text-2 text-lg-3 text-white text-decoration-none'
                  }
                >
                  <div className="d-none d-md-block ps-2">
                    <Phone />
                  </div>
                  <span>021-4780</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <License />
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
