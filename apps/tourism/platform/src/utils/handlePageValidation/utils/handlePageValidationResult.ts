import { HandlePageValidationResult } from '../types/common';

export const createNotFoundResult = (): HandlePageValidationResult => ({
  isValid: false,
  response: {
    notFound: true,
  },
});

export const createRedirectResult = (destination: string): HandlePageValidationResult => ({
  isValid: false,
  response: {
    redirect: {
      destination,
      permanent: true,
    },
  },
});
