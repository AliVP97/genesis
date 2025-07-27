import { FieldErrors } from 'react-hook-form';

export const getErrorMessage = (errors: FieldErrors, fieldName: string): string | null => {
  const error = errors?.[fieldName];
  return error ? (error.message as string) : null;
};
