import { CountriesList } from 'services/general/passenger/interface';

export const SetCountrySort = (countries: CountriesList[]): CountriesList[] => {
  return [
    ...countries.filter((x) => x.countryAlpha2 === 'IR'),
    ...countries
      .filter((x) => x.countryAlpha2 !== 'IR')
      .sort((a, b) => a.countryNameEn!.localeCompare(b.countryNameEn!)),
  ];
};
