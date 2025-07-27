import * as Sentry from '@sentry/nextjs';

export const captureInvalidUrl = ({ service, url }: { url: string; service: string }) => {
  Sentry?.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag('service', service);
    Sentry?.captureMessage(`Invalid url - ${url}`);
  });
};
