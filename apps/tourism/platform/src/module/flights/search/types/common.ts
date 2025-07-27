export type SearchQuery = {
  adult: string;
  child: string;
  infant: string;
  sort: 'lowPrice' | 'earliestTime' | 'recentTime' | 'highPrice';
  returningDate?: string;
  departureDate: string;
};

export type Location = {
  airport: string;
  city: string;
  value: string;
};
