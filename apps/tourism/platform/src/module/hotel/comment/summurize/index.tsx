import { SummurizeComment } from 'assets/icons';
import styles from './summurize.module.scss';

type SummurizeProps = {
  text?: string;
};

const Summurize = (props: SummurizeProps) => {
  const { text } = props;

  return (
    <div className={styles.container}>
      <div className="d-flex gap-1 align-items-center text-weight-400 ">
        <div>
          <SummurizeComment />
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="color-on-secondary-fixed text-weight-400 text-3">
            خلاصه نظرات هتل به کمک هوش مصنوعی
          </div>
          {/* <div className="color-secondary text-2">خلاصه نظرات هتل به کمک هوش مصنوعی</div> */}
        </div>
      </div>
      <div className={`${styles.summarizeText} color-black-4 mt-4 text-3`}>{text}</div>
    </div>
  );
};

export default Summurize;
