import { PassengerV2EditPayload, TPassengerV2 } from 'services/general/passenger/interface';

// probability of missing keys in payload while buy by passport or national code
const MISSING_KEYS = ['persianName', 'persianFamily', 'passportId', 'phoneNumber'];

/**
 * This method is used to normalize passenger edit payload and fill missing keys
 * with passenger data if they are not provided in payload.
 *
 * @param payload passenger edit payload
 * @param passenger original passenger data
 * @returns {PassengerV2EditPayload} normalized payload
 */
export function normalizeEditPassengerPayload(
  payload: PassengerV2EditPayload,
  passenger: TPassengerV2,
  byPassport = false,
): PassengerV2EditPayload {
  const newPayload = JSON.parse(JSON.stringify(payload));

  // if buy should be applied by passport so it has birth day in gregorian not
  // persian is provided, we should not use hijriBirthdayString
  if (byPassport) {
    newPayload.body.birthdayString = newPayload.body.hijriBirthdayString;
    newPayload.body.hijriBirthdayString = '';
  }

  for (const missingKey of MISSING_KEYS) {
    if (payload.body[missingKey as keyof PassengerV2EditPayload]) {
      continue;
    }

    const value = passenger[missingKey as keyof TPassengerV2];

    if (typeof value === 'string') {
      newPayload.body[missingKey] = value;
    }
  }

  return newPayload;
}
