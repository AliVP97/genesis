import { Enamad, Samandehi, PaxRightsLogo, CAALogo } from 'assets/images';
import { StaticImageData } from 'next/image';

interface ILicense {
  title: string;
  src: StaticImageData;
  link: string;
}

export const Licenses: Array<ILicense> = [
  // {
  //   title: 'نرخ نامه مسافران',
  //   src: NerkhName,
  // },
  // {
  //   title: 'حقوق مسافران',
  //   src: HoghogheMosafer,
  // },
  // {
  //   title: 'نرخ نامه مسافران',
  //   src: CivilAviationOrganization,
  // },
  // {
  //   title: 'سازان کسب و کار مجازی کشور',
  //   src: NationalUnionOfVirtualBusinesses,
  // },
  {
    title: 'logo-paxrights',
    src: PaxRightsLogo,
    link: 'https://farasa.cao.ir/sysworkflow/fa/modern/3810212626028ab03488017019616799/6464336316028ab04e3c618028352200.php',
  },
  {
    title: 'logo-caa',
    src: CAALogo,
    link: 'https://caa.gov.ir/',
  },
  {
    title: 'سازمان ساماندهی مجازی',
    src: Samandehi,
    link: 'https://logo.samandehi.ir/Verify.aspx?id=272445&p=uiwkjyoeuiwkaodsaodsdshw',
  },
  {
    title: 'ای نماد',
    src: Enamad,
    link: 'https://trustseal.enamad.ir/?id=287300&code=N4Y1j8txFN8V6pTHcyPM',
  },
];
