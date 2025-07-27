import { Info } from 'assets/icons';

export type TTourPolicyText = { type: string };

const PolicyTextDesktop = ({ type }: TTourPolicyText) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_CALLBACK_URL}page/tourism-terms/`;
  const tourType = type === 'domestic' ? 'tour' : 'internationalTour';
  return (
    <div className="d-flex gap-2 align-items-center">
      <Info />
      <span className="fs-3 color-grey-1">
        ادامه فرایند خرید، به منزله تایید
        <a className="text-decoration-none" href={`${baseUrl}${tourType}`}>
          &nbsp; قوانین و مقررات &nbsp;
        </a>
        وبسایت هف‌هشتاد توسط شما می باشد.
        <br />
        پس از تکمیل فرایند خرید ، پشتیبانی با شما در تماس خواهد بود.
      </span>
    </div>
  );
};

export default PolicyTextDesktop;
