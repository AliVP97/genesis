import cn from 'classnames';
import UserQuideItem from './userGuideItem';
import styles from './userGuid.module.scss';
import { UserQuid } from 'containers/landingPage/types';
import React from 'react';

type userQuiedProps = {
  userQuieds: Array<UserQuid>;
};
const UserQuide = ({ userQuieds }: userQuiedProps) => {
  return (
    <>
      <div className={cn(styles['user-guid'])}>
        {React.Children.toArray(
          userQuieds?.map((item, index) => {
            return (
              <>
                <UserQuideItem
                  key={index.toString() + item.title}
                  title={item.title}
                  description={item.description}
                />
              </>
            );
          }),
        )}
      </div>
    </>
  );
};

export default UserQuide;
