import CmsFaq from './faq';
import { CmsFaqProps } from './faq/types';
import Preposition from './preposition';
import { PrepositionProps } from './preposition/types';
import { SuppliersProps } from './suppliers/types';
import Suppliers from './suppliers';
import { RichTextPropsType } from './richText/types';
import RichTextComponent from './richText';
import CompanyAdvice from './companyAdvice';
import { FC } from 'react';
import { BusyRoutesProps } from './busyRoutes/types';
import BusyRoutes from './busyRoutes';
import { MagProps } from './mag/types';
import Mag from './mag';
import { MetaSeoProps } from './seo/type';
import { NewSeoMeta } from './seo';
import { SupportHeaderProps } from './support/header/types';
import SupportHeader from './support/header';
import { SupportBodyProps } from './support/body/types';
import SupportBody from './support/body';
import { SupportFooterProps } from './support/footer/types';
import SupportFooter from './support/footer';
import { VisaPriceTableProps } from './visa/visaPriceTable/types';
import VisaPriceTable from './visa/visaPriceTable';
import { VisaLandingHeroProps } from './visa/visaLandingHero/types';
import VisaLandingHero from './visa/visaLandingHero';
import { VisaConditionsProps } from './visa/visaConditions/types';
import VisaConditions from './visa/visaConditions';
import { VisaDescriptionProps } from './visa/visaDescription/types';
import VisaDescription from './visa/visaDescription';
import { VisaExplanationProps } from './visa/visaExplanation/types';
import VisaExplanation from './visa/visaExplanation';
import VisaPriceInfo from './visa/visaPriceInfo';
import { VisaPriceInfoProps } from './visa/visaPriceInfo/types';
import { VisaPageHeroProps } from './visa/visaPageHero/types';
import VisaPageHero from './visa/visaPageHero';
import { VisaValidityPeriodProps } from './visa/visaValidityPeriod/types';
import VisaValidityPeriod from './visa/visaValidityPeriod';
import { VisaGuidanceImageProps } from './visa/visaGuidanceImage/types';
import VisaGuidanceImage from './visa/visaGuidanceImage';
import Download from './downloadApp';
import { DownloadProps } from './downloadApp/types';

export const FaqBlock: FC<CmsFaqProps> = ({ title, items }) => {
  return <CmsFaq title={title} items={items} />;
};

export const PrepositionBlock: FC<PrepositionProps> = ({ items }) => {
  return <Preposition items={items} />;
};

export const DowloadAppBlock: FC<DownloadProps> = ({
  title,
  body,
  image,
  qrcode,
  qrcodePosition,
}) => {
  return (
    <Download
      title={title}
      body={body}
      image={image}
      qrcode={qrcode}
      qrcodePosition={qrcodePosition}
    />
  );
};

export const SuppliersBlock: FC<SuppliersProps> = ({ title, items }) => {
  return <Suppliers title={title} items={items} />;
};

export const RichTextBlock: FC<RichTextPropsType> = ({ title, body, image, summary }) => {
  if (image) {
    return <RichTextComponent title={title} body={body} summary={summary} image={image} />;
  } else {
    return <CompanyAdvice title={title} body={body} summary={summary} />;
  }
};

export const BusyRoutesBlock: FC<BusyRoutesProps> = ({ title, items }) => {
  return <BusyRoutes title={title} items={items} />;
};

export const MagBlock: FC<MagProps> = ({ title, items }) => {
  return <Mag title={title} items={items} />;
};

export const SeoBlock: FC<MetaSeoProps> = ({ metaData, children }) => {
  return <NewSeoMeta metaData={metaData}>{children}</NewSeoMeta>;
};

export const supportHeaderBlock: FC<SupportHeaderProps> = ({ surveyButton, image }) => {
  return <SupportHeader surveyButton={surveyButton} image={image} />;
};

export const SupportBodyBlock: FC<SupportBodyProps> = ({ description, contactMethods }) => {
  return <SupportBody description={description} contactMethods={contactMethods} />;
};

export const SupportFooterBlock: FC<SupportFooterProps> = ({ buttonList }) => {
  return <SupportFooter buttonList={buttonList} />;
};

export const VisaLandingHeroBlock: FC<VisaLandingHeroProps> = ({ title, cover, visaCards }) => {
  return <VisaLandingHero title={title} cover={cover} visaCards={visaCards} />;
};

export const VisaPriceTableBlock: FC<VisaPriceTableProps> = ({ title, items }) => {
  return <VisaPriceTable title={title} items={items} />;
};

export const VisaConditionsBlock: FC<VisaConditionsProps> = ({
  title,
  description,
  items,
  info,
}) => {
  return <VisaConditions title={title} description={description} items={items} info={info} />;
};

export const VisaDescriptionBlock: FC<VisaDescriptionProps> = ({ content }) => {
  return <VisaDescription content={content} />;
};

export const VisaExplanationBlock: FC<VisaExplanationProps> = ({ title, image, body }) => {
  return <VisaExplanation title={title} body={body} image={image} />;
};

export const VisaPriceInfoBlock: FC<VisaPriceInfoProps> = ({ title, body, image }) => {
  return <VisaPriceInfo title={title} body={body} image={image} />;
};

export const VisaPageHeroBlock: FC<VisaPageHeroProps> = ({ title, items, flag, cover }) => {
  return <VisaPageHero title={title} items={items} flag={flag} cover={cover} />;
};

export const VisaValidityPeriodBlock: FC<VisaValidityPeriodProps> = ({
  title,
  description,
  image,
}) => {
  return <VisaValidityPeriod title={title} description={description} image={image} />;
};

export const VisaGuidanceIMageBlock: FC<VisaGuidanceImageProps> = ({ desktop, mobile }) => {
  return <VisaGuidanceImage desktop={desktop} mobile={mobile} />;
};
