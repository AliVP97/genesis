import { BaggageDetail } from 'module/internationalFlight/tickets/types/api';

/**
 * Whenever we need to display baggage details:
 * - If quantity and weight are available so we need to show both in this format  `2
 *   x 20 KG`.
 * - if quantity is available and weight is not available then we need to show
 *   only quantity in this format `2 عدد`.
 * - if quantity is not available and weight is available then we need to show `2 KG`
 *
 * @param details the data of baggage
 * @returns string or undefined
 */
export default function getBaggageDescription(details: BaggageDetail): string | undefined {
  const { weight, quantity } = details;

  if (weight && quantity) {
    return `${weight} KG`;
  }

  if (quantity) {
    return `${quantity} عدد`;
  }

  if (weight) {
    return `${weight} KG`;
  }

  return undefined;
}
