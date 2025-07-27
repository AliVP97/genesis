import React, { HTMLProps, useState } from 'react';
import AddForm from '../addForm';
import styles from './addBtn.module.scss';

interface IAddBtnProps extends HTMLProps<HTMLButtonElement> {
  children: React.ReactNode;
  getPassengers: () => void;
}
const AddBtn = ({ children, getPassengers }: IAddBtnProps) => {
  const [addForm, setAddForm] = useState<boolean>(false);

  return (
    <>
      <button className={styles['add-btn']} onClick={() => setAddForm(true)}>
        {children}
      </button>
      <AddForm getPassengers={getPassengers} setShowForm={setAddForm} showForm={addForm} />
    </>
  );
};

export default AddBtn;
