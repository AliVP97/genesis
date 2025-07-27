import cn from 'classnames';
import styles from '../../styles/invoice.module.scss';
import { ArrowRightPurpleIcon } from 'assets/icons';
import Modal from 'components/modal';
import { Dispatch } from 'react';

type RulesModalProps = {
  visible: boolean;
  rules: string[];
  setIsVisibleModal: Dispatch<boolean>;
};

const RulesModal = ({ visible, rules, setIsVisibleModal }: RulesModalProps) => {
  return (
    <Modal visible={visible}>
      <section className="w-100 h-100 bg-white rtl">
        <header className={cn(styles.invoice__refund__modal__header, 'px-4 py-3 bg-color-grey-20')}>
          <div className="d-flex justify-content-center align-items-center">
            <span className="text-4 text-weight-500 color-black-2">
              شرایط استفاده استرداد بدون جریمه
            </span>
            <span className="cursor-pointer position-fixed top-0 end-0 mt-3 me-3">
              <ArrowRightPurpleIcon
                className="cursor-pointer"
                onClick={() => setIsVisibleModal(false)}
              />
            </span>
          </div>
        </header>
        <ul className="mb-0 text-3 py-4 px-4 me-3">
          {rules?.map((item, pIndex) => (
            <li className="mb-2 text-justify color-black-2" key={pIndex + 'refund-policy'}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </Modal>
  );
};
export default RulesModal;
