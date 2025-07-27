import { useState } from 'react';
import parse from 'html-react-parser';
import { TFlightContentsTabs } from 'services/domestic/flight/interface';
import style from './style.module.scss';
import { TTabsData } from './types';

export type TProps = {
  data?: TFlightContentsTabs;
  staticData?: TTabsData;
  status?: string;
};

const Tabs = ({ data, staticData, status }: TProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  const tabData = status === 'error' || !data ? staticData : data;
  return (
    <div className={style.main}>
      <ul className={style.tabs}>
        {tabData?.map((item, index: number) => {
          return (
            <li key={index.toString() + item.title} className={style.tab}>
              <button
                className={activeTab === index ? style.active : ''}
                onClick={() => {
                  handleTabClick(index);
                }}
              >
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={style.contents}>
        {tabData?.map((item, index: number) => {
          const description =
            status === 'error' || !data ? item.description : parse(item.description as string);
          return (
            <div
              key={index.toString() + item.title}
              className={activeTab === index ? style.active : ''}
            >
              {description}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Tabs };
