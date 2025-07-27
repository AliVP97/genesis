export const GET_PASSENGER_FIELDS = (serviceName: string) => {
  return `passenger/v3/passenger/fields/${serviceName}`;
};
export const GET_PASSENGER_OPTIONS = (serviceName: string) => {
  return `/passenger/v3/options?serviceName=${serviceName}`;
};
export const GET_ALL_PASSENGER = (serviceName: string, referenceDate?: string) => {
  let query = `serviceName=${serviceName}`;
  if (referenceDate) {
    query += `&referenceDate=${referenceDate}`;
  }
  return `/passenger/v3/passenger?${query}`;
};
export const ADD_PASSENGER = () => {
  return `passenger/v3/passenger`;
};

export const UPDATE_PASSENGER = (id: string) => {
  return `passenger/v3/passenger/${id}`;
};
export const DELETE_PASSENGER = (id: string) => {
  return `passenger/v3/passenger/${id}`;
};
