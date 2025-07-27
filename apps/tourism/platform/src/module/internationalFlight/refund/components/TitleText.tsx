import { FC } from 'react';
import styles from './Title.module.scss';

const Title: FC = ({ children }) => <span className={styles.title}>{children}</span>;

export default Title;
