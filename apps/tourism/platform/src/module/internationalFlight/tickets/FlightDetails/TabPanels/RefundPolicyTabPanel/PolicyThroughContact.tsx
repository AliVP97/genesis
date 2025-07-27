import classNames from 'classnames';
import Card, { HighlightedCardHeader } from '../../Card';
import HighlightedCardContent from '../../Card/HighlightedCardContent';
import styles from './RefundPolicyTabPanel.module.scss';

const PolicyThroughContact = () => (
  <Card hasPadding={false}>
    <HighlightedCardHeader title="جریمه استرداد" />
    <HighlightedCardContent className={classNames(styles['card-content'])}>
      مسافر گرامی، برای اطلاع از شرایط استرداد، لطفا با پشتیبانی (4780-021) تماس بگیرید
    </HighlightedCardContent>
  </Card>
);

export default PolicyThroughContact;
