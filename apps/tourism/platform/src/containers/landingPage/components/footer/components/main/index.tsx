import {
  CivilAviationIcon,
  EnamadLogo,
  LocationLightIcon,
  LogoWhite,
  PaxrightsIcon,
  RajaLogo,
  TelephoneLightIcon,
} from 'assets/icons';
import cn from 'classnames';
import styles from './footer.module.scss';
import Link from 'next/link';
import DownloadLinks from '../footerDownload';
import { useRouter } from 'next/router';
import Image from 'next/image';
import FooterSocialNetwork from '../socialNetwork';
import { FOOTER_SERVICES, FOOTER_SOCIAL_NETWORK, MOBILE_FOOTER_SERVICES } from './data';
import { HAFHASHTAD_TEL } from 'utils/static/global';

export const Main = () => {
  const router = useRouter();

  return (
    <div className="container">
      <div className="content">
        <div className="row">
          <div className="col-12 px-0">
            <div className={cn(styles['footer'], 'pb-2')}>
              <div className="d-flex flex-column-reverse flex-lg-row-reverse">
                <div className=" d-lg-flex flex-row-reverse justify-content-end flex-grow-1">
                  <div className="text-end text-on-primary col-lg-3 py-2">
                    <div className="ms-4 me-2 my-3">
                      <LogoWhite />
                    </div>
                    <p
                      className={cn(
                        styles['footer__text'],
                        'mx-2 my-3 text-2 ps-2 text-weight-400 color-on-primary rtl',
                      )}
                    >
                      هف‌هشتاد، پلتفرم و سوپر اپلیکیشن پیشرفته است که خدمات مالی و گردشگری را به
                      سادگی از طریق اپلیکیشن، وب‌سایت و کد USSD در اختیار شما قرار می‌دهد. به علاوه،
                      با هف‌هشتاد می‌توانید به راحتی خرید بلیط هواپیما داخلی و خارجی، خرید بلیط
                      قطارو اتوبوس، رزرو تور مسافرتی و هتل را انجام دهید. امکان اخذ ویزای توریستی،
                      پرداخت قبض، کارت به کارت، خرید شارژ، خرید بسته اینترنت و دریافت موجودی نیز
                      برای شما در این سامانه فراهم است. هف‌هشتاد با تمرکز بر مسئولیت‌های اجتماعی، در
                      بهبود رفاه عمومی نیز نقش دارد.هدف ما ایجاد تجربه‌ای ساده و آسان است که پاسخگوی
                      تمامی نیازهای روزمره و سفر شما باشد.
                    </p>
                  </div>
                  <div className="d-flex flex-row-reverse col-lg-9">
                    <div className="d-none d-lg-flex col-lg-7">
                      {FOOTER_SERVICES?.map((item, index: number) => (
                        <div className="text-end w-100 py-2" key={index.toString() + item.title}>
                          <h4 className="text-2 text-weight-500 color-on-primary ms-4 me-2 my-3 pb-3">
                            {item.title}
                          </h4>
                          {item?.subItems?.map((subItem, index: number) => (
                            <div key={index.toString() + subItem.title}>
                              {subItem.noFollow ? (
                                <a
                                  href={subItem.url}
                                  className="mx-2 my-3 text-2 text-weight-400 d-block nostyle color-on-primary text-decoration-none"
                                >
                                  {subItem?.title}
                                </a>
                              ) : (
                                <Link href={subItem.url}>
                                  <a className="mx-2 my-3 text-2 text-weight-400 d-block nostyle color-on-primary text-decoration-none">
                                    {subItem?.title}
                                  </a>
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="pb-3 p-lg-0 col-lg-5">
                      <div>
                        {router.pathname !== '/app/dl' && (
                          <div
                            className={cn(
                              styles['footer__download-buttons-wrapper'],
                              'd-flex flex-wrap justify-content-between pb-3 py-lg-2',
                            )}
                          >
                            <h4 className="d-none d-lg-block text-center w-100 text-2 text-weight-500 color-on-primary mx-3 pb-3 mt-3">
                              دانلود اپلیکیشن هف‌هشتاد
                            </h4>
                            <DownloadLinks />
                          </div>
                        )}
                      </div>
                      <div>
                        <FooterSocialNetwork data={FOOTER_SOCIAL_NETWORK} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-lg-none d-flex flex-row-reverse justify-content-between flex-grow-1">
                <div className="text-end w-100 py-2 d-flex px-2 justify-content-center flex-row-reverse flex-wrap">
                  {MOBILE_FOOTER_SERVICES?.subItems?.map((subItem, index: number) => (
                    <div
                      key={index.toString() + subItem.title + 'footer'}
                      className="d-flex align-items-center justify-content-evenly"
                    >
                      <span className="color-on-primary">
                        {index + 1 !== MOBILE_FOOTER_SERVICES?.subItems.length && '|'}
                      </span>
                      {subItem.noFollow ? (
                        <a
                          href={subItem.url}
                          className="mx-2 my-3 text-1 text-weight-400 d-block nostyle text-nowrap color-on-primary text-decoration-none"
                        >
                          {subItem?.title}
                        </a>
                      ) : (
                        <Link href={subItem.url}>
                          <a className="mx-2 my-3 text-1 text-weight-400 d-block nostyle text-nowrap color-on-primary text-decoration-none">
                            {subItem?.title}
                          </a>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <hr className="d-flex d-lg-none mx-auto mb-3 mt-0 px-4 color-primary-container" />
              <div className="d-flex flex-column flex-lg-row-reverse justify-content-lg-start mb-2 col-12">
                <div className="mb-2 text-center text-lg-end col-lg-8">
                  <address dir={'rtl'} className="d-lg-flex text-2 text-lg-3 mb-2 color-on-primary">
                    <LocationLightIcon className="d-none d-lg-inline-block ms-2" />
                    آدرس دفتر مرکزي: تهران - خيابان جمهوري - تقاطع اسکندري جنوبي - ساختمان 510
                  </address>
                  <div>
                    <Link href={`tel:${HAFHASHTAD_TEL}`}>
                      <a
                        dir={'rtl'}
                        className="d-lg-flex text-center text-2 text-lg-3 color-on-primary text-decoration-none"
                      >
                        <TelephoneLightIcon className="d-none d-lg-inline-block ms-2" />
                        021-4780
                      </a>
                    </Link>
                  </div>
                </div>
                <div className={styles['footer__contract-list']}>
                  <div
                    className={styles['footer__contract-list__image']}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        'https://trustseal.enamad.ir/?id=287300&code=N4Y1j8txFN8V6pTHcyPM',
                        'enamad',
                        'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30',
                      )
                    }
                  >
                    <EnamadLogo />
                  </div>
                  <div
                    className={styles['footer__contract-list__image']}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        'https://logo.samandehi.ir/Verify.aspx?id=272445&p=uiwkjyoeuiwkaodsaodsdshw',
                        'samandehi',
                        'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30',
                      )
                    }
                  >
                    <Image
                      src="/tourism/images/samandehi-logo.png"
                      width={42}
                      height={42}
                      alt="logo-samandehi"
                      className="rounded"
                    />
                  </div>
                  <div
                    className={styles['footer__contract-list__image']}
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.open('https://caa.gov.ir/')}
                  >
                    <a target="_blank" href="https://caa.gov.ir/" rel="noreferrer">
                      <CivilAviationIcon />
                    </a>
                  </div>
                  <div
                    style={{ cursor: 'pointer' }}
                    className={styles['footer__contract-list__image']}
                  >
                    <a
                      target="_blank"
                      href="https://farasa.cao.ir/sysworkflow/fa/modern/3810212626028ab03488017019616799/6464336316028ab04e3c618028352200.php"
                      rel="noreferrer"
                    >
                      <PaxrightsIcon />
                    </a>
                  </div>
                  <div
                    style={{ cursor: 'pointer' }}
                    className={styles['footer__contract-list__image']}
                  >
                    <a target="_blank" href="https://Raja.ir" rel="noreferrer">
                      <RajaLogo />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
