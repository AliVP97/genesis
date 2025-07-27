import { ArrowDownIcon } from 'assets/icons';
import cn from 'classnames';
import styles from 'module/internationalFlight/tickets/component/intelFlightDetail/ticketDetail.module.scss';
import { detailOptions, TabType } from 'module/internationalFlight/tickets/interface';

interface DetailHeaderProps {
  onClose: (() => void) | undefined;
  handleSelectTab: (tab: TabType) => void;
  activeTab: TabType;
  isDesktop: boolean;
}

export const DetailHeader = ({
  onClose,
  handleSelectTab,
  activeTab,
  isDesktop,
}: DetailHeaderProps) => {
  return (
    <div className={styles['ticket-detail__header']}>
      {!isDesktop && (
        <div className="p-3 d-flex flex-row-reverse">
          <div onClick={onClose} className="col-md">
            <ArrowDownIcon className={cn('fill-tertiary')} />
          </div>
          <span className="text-center col ps-4 align-self-center">اطلاعات سفر</span>
        </div>
      )}
      <div dir="rtl" className={cn(styles['ticket-detail__tabs'], 'd-flex')}>
        {detailOptions.map((item) => (
          <div
            className={cn(
              styles['ticket-detail__tabs__tab'],
              'd-flex flex-column align-items-center text-center justify-content-around',
              item.value === activeTab && styles['ticket-detail__tabs__tab--active'],
            )}
            onClick={() => handleSelectTab(item.value)}
            key={item.value}
          >
            <span className={styles['tabs__tab--title']}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
