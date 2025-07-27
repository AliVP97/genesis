import cn from 'classnames';
import Style from './style.module.scss';
import { IDesktopSuggestionProps } from '../../types';
import { Location } from 'assets/icons';

const DesktopSuggestion = ({
  activeInputName,
  mappedResults,
  defaultData,
  handleOnSelectFrequency,
  results,
  zone,
}: IDesktopSuggestionProps) => {
  return (
    <div>
      {activeInputName === zone && (
        <div className={cn(Style['locations-list'], Style[activeInputName ? activeInputName : ''])}>
          <div className=" pt-2 px-3  text-3 color-grey-border">
            {!results?.[zone]?.length && mappedResults != 'empty list' && defaultData?.title}
          </div>

          {Array.isArray(mappedResults) ? (
            mappedResults.map((element, index) => {
              return (
                <div
                  key={index}
                  className={cn(Style['frequency'], 'd-flex flex-row p-3 m-2')}
                  onClick={() => {
                    handleOnSelectFrequency(element, zone);
                  }}
                >
                  <div className="ps-2">
                    <Location />
                  </div>
                  <div>{element?.title}</div>
                </div>
              );
            })
          ) : (
            <div className=" px-3  pb-2">{mappedResults === 'empty list' && ' موردی یافت نشد'}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopSuggestion;
