import cn from 'classnames';
import styles from '../userGuid.module.scss';
type UserQuideItemProps = {
  title: string;
  description: string;
};
const UserQuideItem = ({ title, description }: UserQuideItemProps) => {
  return (
    <>
      <div className="mb-4 ">
        <div className={cn(styles['user-guid__img'], 'float-end  ms-2')}></div>
        <div className="me-4">
          <h5>{title}</h5>
          <p>{description}</p>
        </div>
      </div>
    </>
  );
};

export default UserQuideItem;
