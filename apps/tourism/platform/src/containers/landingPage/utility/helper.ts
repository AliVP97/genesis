import { OperatingSystem } from '../types';
import dayjs from 'dayjs';

export const IsPhoneNumberValid = (phoneNumber: string): boolean => {
  const pattern = new RegExp('^09[0|1|2|3|9][0-9]{8}$');
  return phoneNumber.length === 11 && !pattern.test(phoneNumber);
};

export const BtnIsValid = (phoneNumber: string): boolean => {
  const pattern = new RegExp('^09[0|1|2|3|9][0-9]{8}$');
  return !pattern.test(phoneNumber);
};

export const detectDeviceOs = (): OperatingSystem => {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  if (macosPlatforms.indexOf(platform) !== -1) {
    return OperatingSystem.Mac_OS;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return OperatingSystem.iOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return OperatingSystem.Windows;
  } else if (/Android/.test(userAgent)) {
    return OperatingSystem.Android;
  } else if (/Linux/.test(platform)) {
    return OperatingSystem.Linux;
  }
  return OperatingSystem.Unknown;
};

export const sendLinkDeviceDetector = (): OperatingSystem => {
  const device = detectDeviceOs();
  if (device !== (OperatingSystem.Android || OperatingSystem.iOS)) {
    return OperatingSystem.Web;
  }
  return device;
};

export const generateFlightBusyRoutesHref = (originCode: string, destinationCode: string) => {
  return `/flights/${originCode}-${destinationCode}`;
};

export const generateInternationalFlightBusyRoutesHref = (
  originCode: string,
  destinationCode: string,
) => {
  return `/international/${originCode}-${destinationCode}`;
};

export const getDomFlightFullQuery = () => {
  return {
    adult: 1,
    child: 0,
    departureDate: dayjs().calendar('jalali').format('YYYY-MM-DD'),
    infant: 0,
    sort: 'lowPrice',
  };
};

export const getIntFlightFullQuery = () => {
  return {
    adult: '1',
    cabinType: 'CABIN_TYPE_ECONOMY',
    child: 0,
    departureDate: dayjs().calendar('jalali').format('YYYY-MM-DD'),
    infant: 0,
    sort: 'lowPrice',
    tripMode: '1',
  };
};
