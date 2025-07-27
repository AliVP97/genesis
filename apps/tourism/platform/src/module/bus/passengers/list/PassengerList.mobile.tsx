import { FunctionComponent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import cn from 'classnames';

import { UsePassengerListReturnType } from './usePassengersList';
import LoginWarning from 'containers/login/loginWarning';
import FormerPassengers from '../former';
import PassengersItem from '../passengersItem';

import Button from 'components/button';
import EmptyResult from 'components/emptyResult';
import { SearchIcon, CircleAddPassengerIcon } from 'assets/icons';

import { TPassengerType, fetchPassengerList } from 'services/general/passenger/interface';
import { PassengerListProps } from './PassengersList';

import PassengerEmpty from 'public/images/empty-passenger-list.png';
import styles from './PassengersList.module.scss';

const PassengerForm = dynamic(() => import('../form'), {
  ssr: false,
});

export const PassengerListMobile: FunctionComponent<
  UsePassengerListReturnType & PassengerListProps
> = (props) => {
  const {
    selected,
    openSearch,
    setOpenSearch,
    visible,
    formVisible,
    data,
    passenger,
    isAdd,
    setIsAdd,
    onDeleteSuccess,
    onSubmitPassengers,
    selectPassenger,
    onCloseModal,
    containerSize,
    isLeaderPage,
  } = props;

  return (
    <div
      className={cn(styles['passengerList'], containerSize === 'md' && styles['containerSizeMd'])}
    >
      {isLeaderPage ? <LeaderSelect {...props} /> : <PassengerSelect {...props} />}
      <PassengerForm
        formVisible={formVisible}
        visible={visible}
        data={data}
        onCloseModal={onCloseModal}
        onDeleteSuccess={onDeleteSuccess}
        onSubmitPassengers={onSubmitPassengers}
        isAdd={isAdd}
        setIsAdd={setIsAdd}
      />
      <FormerPassengers
        passengers={(passenger as fetchPassengerList)?.passengerList as TPassengerType[]}
        selectPassenger={selectPassenger}
        selected={selected}
        open={openSearch}
        setOpen={setOpenSearch}
      />
    </div>
  );
};

const PassengerSelect: FunctionComponent<UsePassengerListReturnType & PassengerListProps> = ({
  setLoginModalVisible,
  login,
  selected,
  maxPassenger,
  openSearch,
  setOpenSearch,
  dropdownId,
  setDropdownId,
  setFormVisible,
  localPassengers,
  passenger,
  passengerLoading,
  searchButtonClicked,
  routeChangeStarted,
  selectPassenger,
  changeFormModal,
  changeModal,
  isSuperapp,
  singleSelect,
  isLoading,
  isTravel,
  hasPassenger,
  goToLeaderSelect,
}) => (
  <>
    {login &&
      !isTravel &&
      (!isLoading ? (
        hasPassenger && (
          <div className="d-flex flex-column">
            <span className="text-3 pb-4">
              لطفا {maxPassenger} مسافر از لیست زیر انتخاب نمایید.
            </span>
            <div className="d-flex flex-column col-12 pb-2 position-relative">
              <SearchIcon className={styles['passenger__search-icon--icon']} />
              <input
                type="number"
                className={cn(styles['passengerList__search--input'], 'color-white-1 color-grey-2')}
                placeholder="جستجوی مسافران"
                name="searchInput"
                onClick={() => setOpenSearch(!openSearch)}
              />
            </div>
          </div>
        )
      ) : (
        <div className={styles['loader']}></div>
      ))}
    {!login && <LoginWarning openLogin={() => setLoginModalVisible(true)} />}
    {login ? (
      <>
        <div className={styles['passengerList__container']}>
          <div className={styles['passengerList__add']}>
            <button onClick={() => setFormVisible(true)}>
              <CircleAddPassengerIcon />
              افزودن مسافر جدید
            </button>
          </div>
          {hasPassenger || localPassengers?.length ? (
            <div>
              {(!login ? localPassengers : passenger?.passengerList)?.map((item) => (
                <PassengersItem
                  key={item.id?.toString() + 'busList'}
                  checked={selected.some((selectedItem) => selectedItem.id === item.id)}
                  passenger={item as TPassengerType}
                  selectPassenger={selectPassenger}
                  open={item.id === dropdownId}
                  closeDropdown={() => setDropdownId('')}
                  openDropdown={(id: string) => setDropdownId(id)}
                  openModal={(data) => changeModal({ data })}
                  edit={(data) => changeFormModal({ data })}
                  selectType={singleSelect ? 'radioButton' : 'checkBox'}
                />
              ))}
            </div>
          ) : (
            <div className="w-75 m-auto pt-5">
              <Image src={PassengerEmpty} alt="مسافری در حال حاضر موجود نمی باشد" />
              <div className="color-grey-2 text-center pt-3">
                <span>هیچ مسافری در لیست مسافران وجود ندارد</span>
              </div>
            </div>
          )}
        </div>

        {!isTravel && (
          <div
            className={cn(
              styles['passengerList__add-passenger'],
              isSuperapp && styles['is-superapp'],
            )}
          >
            <Button
              className={cn(styles['passengerList__add-passenger__btn'], 'btn btn-primary ')}
              disabled={selected.length < maxPassenger}
              loading={passengerLoading || searchButtonClicked || routeChangeStarted}
              onClick={() => {
                goToLeaderSelect();
              }}
              radius
            >
              تایید {selected.length ? `( ${selected.length} مسافر)` : ''}
            </Button>
          </div>
        )}
      </>
    ) : (
      !login &&
      !isLoading && <EmptyResult className="pt-5" handleClick={() => setFormVisible(true)} />
    )}
  </>
);

const LeaderSelect: FunctionComponent<UsePassengerListReturnType & PassengerListProps> = ({
  login,
  selected,
  passengerLoading,
  searchButtonClicked,
  setSearchButtonClicked,
  routeChangeStarted,
  selectLeader,
  handleSubmitPassengers,
  isSuperapp,
  isTravel,
  leaderId,
  isReadyToSubmit,
}) => (
  <>
    <div className="d-flex flex-column">
      <span className="text-3 pb-4">
        لطفا یک نفر از لیست زیر را به عنوان سرپرست مسافران انتخاب نمایید
      </span>
    </div>
    <div className={styles['passengerList__container']}>
      <div>
        {login &&
          selected?.map((item) => (
            <PassengersItem
              key={item.id}
              checked={leaderId === item.id}
              passenger={item as TPassengerType}
              selectPassenger={selectLeader}
              selectType={'radioButton'}
              editable={false}
            />
          ))}
      </div>
    </div>
    {!isTravel && (
      <div
        className={cn(styles['passengerList__add-passenger'], isSuperapp && styles['is-superapp'])}
      >
        <Button
          disabled={!isReadyToSubmit}
          loading={passengerLoading || searchButtonClicked || routeChangeStarted}
          className={cn(styles['passengerList__add-passenger__btn'], 'btn btn-primary ')}
          onClick={() => {
            if (isReadyToSubmit) {
              setSearchButtonClicked(true);
              handleSubmitPassengers();
            }
          }}
          radius
        >
          تایید {selected.length ? `( ${selected.length} مسافر)` : ''}
        </Button>
      </div>
    )}
  </>
);
