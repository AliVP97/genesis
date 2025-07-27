export const getTotalTrainTicketPassenger = (): Array<ITrainEmptyPassenger> => {
  const searchQuery = JSON.parse(localStorage.getItem('train_search_query') as string);
  const passengers: Array<ITrainEmptyPassenger> = Array.from(
    Array(Number(searchQuery?.adult) + Number(searchQuery?.child)).keys(),
  ).map((_, index) => ({
    id: index,
  }));
  return passengers;
};
