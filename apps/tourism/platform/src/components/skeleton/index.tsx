import styles from './skeleton.module.scss';
import ContentLoader from 'react-content-loader';
import cn from 'classnames';
import { omit } from 'lodash';

declare type Direction = 'left-right' | 'top-bottom' | undefined;

interface Props {
  className?: string;
  speed?: number;
  interval?: number;
  gradientDirection?: Direction;
  rtl?: boolean;
  uniqueKey: string;
  type?: string;
  height?: string | number;
  width?: string | number;
}

const Skeleton = (props: Props) => {
  const { className, type } = props;
  const newProps = omit(props, ['className', 'type']);

  return (
    <div className={cn(styles.skeleton, className)}>
      <ContentLoader {...newProps}>
        {type === 'slider' ? (
          <>
            <rect rx="40" ry="40" width="100%" height="100%" />
          </>
        ) : type === 'ticket' ? (
          <>
            <circle cx="23" cy="20" r="18" />
            <rect x="0" y="50" rx="3" ry="3" width="44" height="8" />
            <rect x="80" y="13" rx="3" ry="3" width="28" height="8" />
            <rect x="140" y="13" rx="3" ry="3" width="28" height="8" />
            <rect x="210" y="13" rx="3" ry="3" width="83" height="8" />
            <rect x="80" y="38" rx="3" ry="3" width="59" height="8" />
            <rect x="80" y="60" rx="3" ry="3" width="109" height="8" />
          </>
        ) : type === 'filter' ? (
          <>
            <rect x="0" y="20" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="80" rx="5" ry="5" width="100%" height="2" />
            <rect x="0" y="100" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="145" rx="5" ry="5" width="100%" height="5" />
            <circle cx="4%" cy="145" r="12" />
            <circle cx="96%" cy="145" r="12" />
            <rect x="0" y="180" rx="5" ry="5" width="100%" height="2" />
            <rect x="0" y="200" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="245" rx="24" ry="24" width="30%" height="40" />
            <rect x="100" y="245" rx="24" ry="24" width="30%" height="40" />
            <rect x="200" y="245" rx="24" ry="24" width="30%" height="40" />
            <rect x="0" y="310" rx="5" ry="5" width="100%" height="2" />
            <rect x="0" y="330" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="375" rx="24" ry="24" width="30%" height="40" />
            <rect x="100" y="375" rx="24" ry="24" width="30%" height="40" />
            <rect x="200" y="375" rx="24" ry="24" width="30%" height="40" />
            <rect x="0" y="440" rx="5" ry="5" width="100%" height="2" />
            <rect x="0" y="460" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="505" rx="24" ry="24" width="30%" height="40" />
            <rect x="100" y="505" rx="24" ry="24" width="30%" height="40" />
            <rect x="200" y="505" rx="24" ry="24" width="30%" height="40" />
          </>
        ) : type === 'sort' ? (
          <>
            <rect x="10" y="10" rx="5" ry="5" width="15%" height="30" />
            <rect x="170" y="5" rx="24" ry="24" width="10%" height="40" />
            <rect x="270" y="5" rx="24" ry="24" width="10%" height="40" />
            <rect x="370" y="5" rx="24" ry="24" width="10%" height="40" />
            <rect x="470" y="5" rx="24" ry="24" width="10%" height="40" />
          </>
        ) : type === 'sortTour' ? (
          <>
            <rect x="10" y="4" rx="5" ry="5" width="15%" height="30" />
            <rect x="170" y="4" rx="24" ry="24" width="10%" height="30" />
            <rect x="300" y="4" rx="24" ry="24" width="10%" height="30" />
            <rect x="430" y="4" rx="24" ry="24" width="10%" height="30" />
            <rect x="560" y="4" rx="24" ry="24" width="10%" height="30" />
          </>
        ) : type === 'receipt' ? (
          <>
            <circle cx="50%" cy="18" r="18" />
            <rect x="0" y="60" rx="3" ry="3" width="80" height="8" />
            <rect x="250" y="60" rx="3" ry="3" width="40" height="8" />
            <rect x="0" y="90" rx="3" ry="3" width="120" height="8" />
            <rect x="240" y="90" rx="3" ry="3" width="50" height="8" />
            <rect x="0" y="120" rx="3" ry="3" width="60" height="8" />
            <rect x="230" y="120" rx="3" ry="3" width="60" height="8" />
          </>
        ) : type === 'myTravels' ? (
          <>
            <circle cx="20" cy="20" r="18" />
            <rect x="300" y="20" rx="3" ry="3" width="40" height="8" />
            <rect x="0" y="55" rx="3" ry="3" width="120" height="8" />
            <rect x="0" y="65" rx="3" ry="3" width="120" height="8" />
            <rect x="0" y="75" rx="3" ry="3" width="120" height="8" />
            <rect x="220" y="55" rx="3" ry="3" width="120" height="8" />
            <rect x="220" y="65" rx="3" ry="3" width="120" height="8" />
            <rect x="220" y="75" rx="3" ry="3" width="120" height="8" />
            <rect x="30" y="100" rx="3" ry="3" width="60" height="8" />
            <rect x="250" y="100" rx="3" ry="3" width="60" height="8" />
          </>
        ) : type === 'passengers' ? (
          <>
            <rect x="900" y="20" rx="5" ry="1" width="20" height="20" />
            <rect x="720" y="20" rx="1" ry="1" width="50" height="8" />
            <rect x="730" y="30" rx="1" ry="1" width="30" height="8" />
            <rect x="465" y="20" rx="1" ry="1" width="20" height="8" />
            <rect x="300" y="20" rx="1" ry="1" width="40" height="8" />
            <rect x="120" y="20" rx="1" ry="1" width="60" height="8" />
          </>
        ) : type === 'myTravelsDesktop' ? (
          <>
            <rect x="930" y="20" rx="5" ry="1" width="70" height="10" />
            <rect x="760" y="20" rx="5" ry="1" width="50" height="10" />
            <rect x="510" y="20" rx="5" ry="1" width="120" height="10" />
            <rect x="360" y="20" rx="5" ry="1" width="50" height="10" />
            <rect x="230" y="20" rx="5" ry="1" width="70" height="10" />
            <rect x="150" y="20" rx="5" ry="1" width="40" height="10" />
            <rect x="100" y="20" rx="5" ry="1" width="40" height="10" />
            <rect x="50" y="20" rx="5" ry="1" width="40" height="10" />
          </>
        ) : type === 'trainTickets' ? (
          <>
            <circle cx="23" cy="20" r="18" />
            <rect x="0" y="50" rx="3" ry="3" width="44" height="8" />
            <rect x="80" y="13" rx="3" ry="3" width="28" height="8" />
            <rect x="140" y="13" rx="3" ry="3" width="28" height="8" />
            <rect x="210" y="13" rx="3" ry="3" width="83" height="8" />
            <rect x="80" y="38" rx="3" ry="3" width="170" height="8" />
            <rect x="100" y="60" rx="3" ry="3" width="15" height="15" />
            <rect x="120" y="60" rx="3" ry="3" width="15" height="15" />
            <rect x="80" y="60" rx="3" ry="3" width="15" height="15" />

            <rect x="0" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="20" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="40" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="60" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="80" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="100" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="120" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="140" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="160" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="180" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="200" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="220" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="240" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="260" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="280" y="90" rx="3" ry="3" width="12" height="3" />
            <rect x="300" y="90" rx="3" ry="3" width="12" height="3" />

            <rect x="0" y="120" rx="3" ry="3" width="100" height="10" />
            <rect x="180" y="120" rx="3" ry="3" width="100" height="10" />
          </>
        ) : type === 'trainDetails' ? (
          <>
            <rect x="10" y="10" rx="3" ry="3" width="100" height="10" />
            <rect x="10" y="50" rx="3" ry="3" width="100" height="10" />
            <rect x="10" y="90" rx="3" ry="3" width="100" height="10" />
            <rect x="10" y="130" rx="3" ry="3" width="100" height="10" />
            <rect x="290" y="10" rx="3" ry="3" width="100" height="10" />
            <rect x="290" y="50" rx="3" ry="3" width="100" height="10" />
            <rect x="290" y="90" rx="3" ry="3" width="100" height="10" />
            <rect x="290" y="130" rx="3" ry="3" width="100" height="10" />
          </>
        ) : type === 'trainDetailsPrice' ? (
          <>
            <rect x="10" y="8" rx="3" ry="3" width="100" height="15" />
          </>
        ) : type === 'busSeats' ? (
          <>
            <rect x="0" y="0" rx="3" ry="3" width="20" height="10" />
          </>
        ) : type === 'hotel' ? (
          <>
            <rect x="15" y="15" width="182" height="120" />
            <rect x="210" y="15" width="182" height="120" />
            <rect x="15" y="150" width="136" height="14" />
            <rect x="15" y="180" width="232" height="5" />
            <rect x="15" y="200" width="232" height="5" />
            <rect x="15" y="230" width="58" height="17" />
            <rect x="80" y="230" width="58" height="17" />
            <rect x="145" y="230" width="58" height="17" />
          </>
        ) : type === 'title' ? (
          <>
            <rect x="0" y="0" rx="4" ry="4" width="300" height="25" />
          </>
        ) : type === 'image' ? (
          <>
            <rect x="0" y="0" rx="16" ry="16" width="100%" height="250" />
          </>
        ) : type === 'list' ? (
          <>
            <rect x="20" y="30" width="600" height="10" />
            <rect x="0" y="60" width="600" height="10" />
            <rect x="0" y="90" width="600" height="10" />
            <rect x="0" y="120" width="600" height="10" />
            <rect x="0" y="150" width="600" height="10" />
          </>
        ) : type === 'faq' ? (
          <>
            <rect x="0" y="0" rx="4" ry="4" width="100%" height="70" />
            <rect x="0" y="80" rx="4" ry="4" width="100%" height="70" />
            <rect x="0" y="160" rx="4" ry="4" width="100%" height="70" />
            <rect x="0" y="240" rx="4" ry="4" width="100%" height="70" />
            <rect x="0" y="320" rx="4" ry="4" width="100%" height="70" />
            <rect x="0" y="400" rx="4" ry="4" width="100%" height="70" />
          </>
        ) : type === 'moreInfo' ? (
          <>
            <rect x="0" y="0" rx="16" ry="16" width="100%" height="300" />
            <rect x="0" y="320" rx="16" ry="16" width="100%" height="300" />
            <rect x="0" y="640" rx="16" ry="16" width="100%" height="300" />
          </>
        ) : type === 'tourTickets' ? (
          <>
            <circle cx="8%" cy="50%" r="8%" />
            <rect x="17%" y="12%" rx="3" ry="3" width="20%" height="5%" />
            <rect x="85%" y="12%" rx="3" ry="3" width="15%" height="5%" />
            <rect x="17%" y="35%" rx="3" ry="3" width="4%" height="5%" />
            <rect x="22%" y="35%" rx="3" ry="3" width="4%" height="5%" />
            <rect x="90%" y="40%" rx="3" ry="3" width="6%" height="5%" />
            <rect x="17%" y="55%" rx="3" ry="3" width="4%" height="5%" />
            <rect x="22%" y="55%" rx="3" ry="3" width="4%" height="5%" />
            <rect x="28%" y="55%" rx="3" ry="3" width="6%" height="5%" />
            <rect x="85%" y="55%" rx="3" ry="3" width="15%" height="35%" />
            <rect x="17%" y="80%" rx="3" ry="3" width="30%" height="5%" />
          </>
        ) : type === 'tourLandingSuggestion' ? (
          <>
            <rect x="0" y="0" rx="5" ry="5" width="100" height="25" />
            <rect x="0" y="40" rx="10" ry="10" width="260" height="300" />
            <rect x="280" y="40" rx="10" ry="10" width="260" height="300" />
            <rect x="560" y="40" rx="10" ry="10" width="260" height="300" />
            <rect x="840" y="40" rx="10" ry="10" width="260" height="300" />
            <rect x="1120" y="40" rx="10" ry="10" width="260" height="300" />
            <rect x="1400" y="40" rx="10" ry="10" width="260" height="300" />
          </>
        ) : type === 'tourPdpTabBarItem' ? (
          <>
            <rect x="0" y="0" rx="5" ry="5" width="150" height="25" />
          </>
        ) : type === 'tourPdpGallery' ? (
          <>
            <rect x="0" y="0" rx="10" ry="10" width="100%" height="530" />
          </>
        ) : type === 'tourPdpService' ? (
          <>
            <rect x="0" y="0" rx="10" ry="10" width="100%" height="300" />
          </>
        ) : null}
      </ContentLoader>
    </div>
  );
};

Skeleton.defaultProps = {
  speed: 1.2,
  interval: 0.25,
  gradientDirection: 'left-right',
  rtl: false,
  className: '',
  type: 'ticket',
};

export default Skeleton;
