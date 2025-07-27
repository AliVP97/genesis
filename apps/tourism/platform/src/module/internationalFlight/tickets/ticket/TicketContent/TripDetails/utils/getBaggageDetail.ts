import FlightBaggageDetail from '../types/FlightBaggageDetail';
import { BaggageDetailProps } from '../BaggageDetail';

const NOT_AVAILABLE = '0';

export default function getBaggageDetail(
  detail: FlightBaggageDetail | undefined,
): BaggageDetailProps {
  if (!detail || !Object.values(detail).some(Boolean)) {
    return { status: 'no-information' };
  }

  if (detail.value === NOT_AVAILABLE) {
    return { status: 'not-available' };
  }

  return { status: 'available', text: `${detail.value} ${detail.unit}` };
}
