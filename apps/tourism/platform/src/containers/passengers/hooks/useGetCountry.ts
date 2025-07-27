import { useQuery } from 'react-query';
import { getCountriesList } from 'services/general/passenger';
const UseGetCountry = (enable?: boolean) => {
  const {
    data: countries,
    isSuccess,
    isLoading,
  } = useQuery('countries', getCountriesList, {
    enabled: enable,
    staleTime: Infinity,
  });
  return { countries, isSuccess, isLoading };
};

export default UseGetCountry;
