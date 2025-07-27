import { ICompany } from 'containers/landingPage/types';

export const urlMapper = (urls: Array<ICompany>) => {
  return urls?.map((item) => {
    return {
      urls: `${item?.path?.replace(/^\//, '')}`,
      lastMod: item.lastMod,
    };
  });
};
