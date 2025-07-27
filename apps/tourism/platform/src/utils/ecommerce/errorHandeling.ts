import * as Sentry from '@sentry/nextjs';

export const captureException = (error: unknown) => {
  return Sentry.captureException(error);
};
