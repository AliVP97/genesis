export type CompaniesListStateMemberType = {
  title: string;
  value: string;
  isSelected: boolean;
  logo: string;
  info: string;
};
export type CompaniesListStateType = CompaniesListStateMemberType[];
export type CompaniesListChangeEventType = {
  name: 'companiesList';
  state: CompaniesListStateType;
};
export type CompaniesListOnChangeType = (e: CompaniesListChangeEventType) => void;
export type CompaniesListPropsType = {
  title: string;
  state: CompaniesListStateType;
  onChange: CompaniesListOnChangeType;
  showTotal?: boolean;
  showDropdown?: boolean;
};
