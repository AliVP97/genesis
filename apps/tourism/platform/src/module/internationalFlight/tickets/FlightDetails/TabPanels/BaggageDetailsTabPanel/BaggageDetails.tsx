import getBaggageDescription from '../FlightDetailsTabPanel/utils/getBaggageDescription';
import { BaggageDetail } from 'module/internationalFlight/tickets/types/api';
import { LuggageIcon, NoLuggageIcon, CaryOnBagIcon } from 'assets/icons';
import styles from './BaggageDetails.module.scss';
import classNames from 'classnames';
import { BAGGAGE_LABELS } from './constants/common';
import { BaggageType } from './types/common';

const getBaggageTypeLabel = (baggageType: string | undefined) => {
  if (!baggageType) {
    return '';
  }

  return BAGGAGE_LABELS[baggageType as BaggageType] || '';
};

type BaggageDetailsProps = BaggageDetail;

const BaggageDetails = (props: BaggageDetailsProps) => {
  const baggageType = props.baggageType as BaggageType;
  const baggageTypeTitle = getBaggageTypeLabel(baggageType);
  const baggageDescription = getBaggageDescription(props);

  return (
    <div className="d-flex">
      {baggageDescription && <div className={styles.title}>{baggageTypeTitle}:</div>}
      {baggageDescription && <div className={styles.description}>{baggageDescription}</div>}
      {!baggageDescription && (
        <div className={classNames(styles.description, styles['no-value'])}>بدون بار</div>
      )}
      {baggageType === 'CabinBag' && <CaryOnBagIcon />}
      {baggageType === 'CheckedBag' && baggageDescription && (
        <LuggageIcon className={styles['luggage-icon']} />
      )}
      {baggageType === 'CheckedBag' && !baggageDescription && (
        <NoLuggageIcon className={styles['no-luggage-icon']} />
      )}
    </div>
  );
};

export default BaggageDetails;
