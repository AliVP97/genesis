import { Search as SearchModule } from '@780/domain-tourism';

export const Search = () => {
  const onSubmit = (data: any) => {
    console.log('Search data submitted:', data);
    // Handle the search data submission logic here
  };

  return (
    <>
      <h1>جستجوی بلیط اتوبوس</h1>
      <SearchModule onSubmit={onSubmit} />
    </>
  );
};
