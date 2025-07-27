import cn from 'classnames';
import styles from './travelTabSelector.module.scss';

type TravelTabSelectorProps = {
  activeTab: string;
  fill?: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  tabs: Record<string, string>;
};

const TravelTabSelector = ({ activeTab, setActiveTab, fill, tabs }: TravelTabSelectorProps) => {
  return (
    <>
      {tabs && (
        <div className="w-100 text-center pt-2 d-flex justify-content-between rtl">
          {(Object.keys(tabs) as Array<keyof typeof tabs>).map((key) => {
            return (
              <div
                className={cn(
                  'row',
                  fill && 'flex-grow-1',
                  tabs[key] === activeTab
                    ? styles['item--options--active']
                    : styles['item--options'],
                )}
                onClick={() => setActiveTab(tabs[key])}
                key={key}
              >
                <span> {tabs[key]} </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TravelTabSelector;
