import { Info } from 'assets/icons';
import { TTourPolicyText } from './policyTextDesktop';

const PolicyTextMobile = ({ type }: TTourPolicyText) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_CALLBACK_URL}page/tourism-terms/`;
  const tourType = type === 'domestic' ? 'tour' : 'internationalTour';
  return (
    <div className="bg-color-grey-20 mx-n3 px-3 py-4">
      <div className="d-flex gap-2 align-items-center">
        <Info />
        <span className="fs-2 color-grey-1">
          با کلیک روی تایید و ادامه خرید با
          <a className="text-decoration-none " href={`${baseUrl}${tourType}`}>
            &nbsp; قوانین و مقررات &nbsp;
          </a>
          موافقت کرده‌اید.
          <br />
          جهت ادامه فرایند، پس از خرید پشتیبانی با شما تماس خواهد گرفت.
        </span>
      </div>
    </div>
  );
};

export default PolicyTextMobile;
