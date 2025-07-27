export const handleCallbackURL = (orderId?: string, serviceName?: string) => {
  const callbackURL = new URL(`${window.location.origin}/tourism/receipt/v2`);

  if (orderId) {
    callbackURL.searchParams.append('orderId', orderId);
  }
  if (serviceName) {
    callbackURL.searchParams.append('serviceName', serviceName);
  }

  return callbackURL.toString();
};
