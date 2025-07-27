import { CompaniesListStateType } from 'containers/companiesList/types';
import { cloneDeep } from 'lodash';
import { useMemo } from 'react';
import { BusTickets } from 'services/bus/tickets/interface';
import { removeDuplications, RemoveDuplicationsArrayMemberType } from 'utils/helpers/global';

export const useGetCompanies = (ticketsData: BusTickets) => {
  const companies: CompaniesListStateType = useMemo(() => {
    if (!ticketsData || ticketsData.length == 0) return [];

    return removeDuplications(
      cloneDeep(ticketsData).sort((a, b) => {
        return a.companyName! > b.companyName! ? 1 : -1;
      }) as RemoveDuplicationsArrayMemberType[],
      'companyName',
    ).map((company) => ({
      title: company.companyName,
      value: company.companyName,
      isSelected: false,
      logo: company.logo,
      info: '',
    }));
  }, [ticketsData]);
  return {
    companies,
  };
};
