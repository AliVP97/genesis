import { ChangeEvent, ChangeEventHandler, FunctionComponent } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import cn from 'classnames';

import { UsePassengerListReturnType } from './usePassengersList';
import SelectedTicket from 'module/bus/tickets/components/selectedTicket';
import PassengersItem from '../passengersItem';
import LoginWarningBox from './components/loginWarning';
import Skeleton from 'components/skeleton';
import Spinner from 'components/spinner';
import CustomSelect from 'components/select';
import { CircleAddPassengerIcon, Passenger, SearchIcon } from 'assets/icons';

import { TPassengerType } from 'services/general/passenger/interface';
import { PassengerListProps } from './PassengersList';

import styles from './PassengersList.module.scss';

const PassengerForm = dynamic(() => import('../form'), {
  ssr: false,
});

export const PassengerListDesktop: FunctionComponent<
  UsePassengerListReturnType & PassengerListProps
> = ({
  setLoginModalVisible,
  login,
  selected,
  maxPassenger,
  dropdownId,
  setDropdownId,
  visible,
  isPassengers,
  formVisible,
  localPassengers,
  leaderId,
  setLeaderId,
  data,
  passenger,
  isFetching,
  passengerLoading,
  searchButtonClicked,
  setSearchButtonClicked,
  routeChangeStarted,
  search,
  isAdd,
  setIsAdd,
  onDeleteSuccess,
  onSubmitPassengers,
  selectPassenger,
  onCloseModal,
  changeFormModal,
  changeModal,
  handleSubmitPassengers,
  handleInput,
  containerSize,
  title,
  description,
  singleSelect,
  isReadyToSubmit,
}) => {
  return (
    <div className={cn('container rtl', containerSize === 'md' && styles['containerSizeMd'])}>
      {containerSize !== 'md' && (
        <div className="ltr">
          <SelectedTicket />
        </div>
      )}
      {!login ? (
        <div>
          <LoginWarningBox />
        </div>
      ) : (
        <></>
      )}
      <div
        className={cn(styles['passenger'], 'w-100 d-flex flex-column bg-color-white mb-3')}
        style={{ marginTop: '3%' }}
      >
        <div
          className={cn(
            'd-flex flex-row align-items-center border-bottom border-blue-grey',
            styles['card-title'],
          )}
        >
          <Passenger />
          <div>
            <span>{title || 'انتخاب مسافران'}</span>
          </div>
        </div>
        <div
          className={cn(
            styles['container'],
            'd-flex flex-column p-4 border-bottom border-blue-grey px-5',
            `${isPassengers}`,
          )}
        >
          <div className="d-flex flex-row justify-content-between align-items-center pb-3">
            <span>{description || `لطفا ${maxPassenger} مسافر از لیست زیر انتخاب نمایید.`}</span>
            <div className="position-relative">
              <SearchIcon className={styles['passenger__search-icon']} />
              <input
                placeholder="جستجوی مسافران"
                className={cn(
                  styles['passenger__search'],
                  'text-3 ps-2 pe-4 border-0 bg-color-grey-12',
                )}
                onInput={(e: ChangeEvent<HTMLInputElement>) => handleInput(e)}
              />
            </div>
            {containerSize === 'md' && (
              <button
                onClick={() => setIsAdd(true)}
                className={styles['containerSizeMd__add-new-passenger']}
              >
                <CircleAddPassengerIcon
                  className={styles['containerSizeMd__add-new-passenger__icon']}
                />
                <span>افزودن مسافر جدید</span>
              </button>
            )}
          </div>
          <table className={cn(styles['passenger__items'], 'bg-color-white-1')}>
            <thead>
              <tr
                className={cn(styles['passenger__items__font'], 'bg-color-blue-grey color-grey-1')}
              >
                {containerSize !== 'md' && (
                  <th className={styles['passenger__items__radius-right']}></th>
                )}
                <th className="text-center">نام و نام خانوادگی به لاتین</th>
                <th className="text-center">جنسیت</th>
                <th className="text-center">کد ملی</th>
                <th className="text-center">شماره پاسپورت</th>
                <th className="text-center"> تاریخ انقضای پاسپورت </th>
                <th className="text-center">تاریخ تولد</th>
                <th className={styles['passenger__items__radius-left']} />
              </tr>
            </thead>
            {login &&
              (passengerLoading || isFetching ? (
                <thead>
                  <tr>
                    <th colSpan={6}>
                      <Skeleton
                        type={'passengers'}
                        uniqueKey={'passengers'}
                        width="100%"
                        height="50px"
                      />
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={6}>
                      <Skeleton
                        type={'passengers'}
                        uniqueKey={'passengers'}
                        width="100%"
                        height="50px"
                      />
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={6}>
                      <Skeleton
                        type={'passengers'}
                        uniqueKey={'passengers'}
                        width="100%"
                        height="50px"
                      />
                    </th>
                  </tr>
                </thead>
              ) : (
                <tbody>
                  {(!login ? localPassengers : passenger?.passengerList)
                    ?.map((item, index) => {
                      return (
                        <PassengersItem
                          key={item.id}
                          indexArr={index}
                          lengthArr={passenger?.passengerList?.length}
                          checked={selected.some((selectedItem) => selectedItem.id === item.id)}
                          passenger={item as TPassengerType}
                          selectPassenger={selectPassenger}
                          open={item.id === dropdownId}
                          closeDropdown={() => setDropdownId('')}
                          openDropdown={(id: string) => setDropdownId(id)}
                          openModal={(data) => changeModal({ data })}
                          edit={(data) => changeFormModal({ data })}
                          setIsAdd={setIsAdd}
                          showCheckbox={containerSize !== 'md'}
                          selectType={singleSelect ? 'radioButton' : 'checkBox'}
                        />
                      );
                    })
                    .filter((el) => {
                      if (search?.length) {
                        if (
                          el.props.passenger.persianName?.includes(search) ||
                          el.props.passenger.persianFamily?.includes(search) ||
                          el.props.passenger.englishName
                            ?.toLowerCase()
                            .includes(search?.toLowerCase()) ||
                          el.props.passenger.englishFamily
                            ?.toLowerCase()
                            .includes(search?.toLowerCase())
                        )
                          return el;
                      } else return el;
                    })}
                </tbody>
              ))}
          </table>
        </div>
        <PassengerForm
          formVisible={formVisible}
          visible={visible}
          data={data}
          onCloseModal={onCloseModal}
          onDeleteSuccess={onDeleteSuccess}
          onSubmitPassengers={onSubmitPassengers}
          isAdd={isAdd}
          setIsAdd={setIsAdd}
          containerSize={containerSize}
        />
      </div>
      {maxPassenger > 1 && (
        <div
          className={cn(styles['passenger'], 'w-100 d-flex flex-column bg-color-white mb-3')}
          style={{ marginTop: '3%' }}
        >
          <div
            className={cn(
              'd-flex flex-row align-items-center border-bottom border-blue-grey',
              styles['card-title'],
            )}
          >
            <Passenger />
            <div>
              <span>{title || 'انتخاب سرپرست مسافران'}</span>
            </div>
          </div>
          <div
            className={cn(
              'd-flex flex-column align-items-start p-4 border-bottom border-blue-grey px-5',
            )}
          >
            <div className="d-flex flex-row justify-content-between align-items-center pb-3">
              <span>لطفا یک نفر از لیست زیر را به عنوان سرپرست مسافران انتخاب نمایید</span>
            </div>
            <CustomSelect
              label="سرپرست مسافران"
              field={{
                name: 'select',
                value: leaderId,
                disabled: selected.length === 0,
                onChange: (({ target: { value } }) => {
                  setLeaderId(value);
                }) as ChangeEventHandler<HTMLSelectElement>,
              }}
              options={selected.map(({ id, persianName, persianFamily }) => ({
                value: id || '',
                label: `${persianName} ${persianFamily}`,
              }))}
              isError={false}
              errorText=""
              className={styles['select-leader']}
            />
          </div>
        </div>
      )}
      {containerSize !== 'md' && (
        <div
          className={cn(
            styles['footer'],
            'd-flex flex-row justify-content-between bg-color-white p-4 align-items-center',
          )}
        >
          <div className="col-6"></div>
          <div className="col-6 ltr">
            <button
              className={cn(
                styles['footer__btn'],
                ' py-2 px-4 border-0 me-3',
                isReadyToSubmit ? 'bg-color-primary' : 'bg-color-grey-1',
                (searchButtonClicked || routeChangeStarted) && styles['footer__btn--loading'],
              )}
              disabled={!isReadyToSubmit}
              onClick={() => {
                !login && setLoginModalVisible(true);
                if (isReadyToSubmit) {
                  setSearchButtonClicked(true);
                  handleSubmitPassengers();
                }
              }}
            >
              {searchButtonClicked || routeChangeStarted ? <Spinner /> : <> تایید و ادامه</>}
            </button>
            <button
              className={cn(styles['footer__btn'], 'bg-color-white color-grey-1 text-3 py-2 px-4')}
              onClick={() => Router.back()}
            >
              <span>بازگشت</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
