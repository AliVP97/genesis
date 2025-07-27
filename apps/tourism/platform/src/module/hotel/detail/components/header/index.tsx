import { Star } from 'assets/icons';

interface IHeaderProps {
  title: string;
  rate: number;
}
const Header = ({ rate, title }: IHeaderProps) => {
  return (
    <>
      <h5>{title}</h5>
      {Array.from({ length: rate }).map((x) => (
        <Star key={x?.toString() + 'hotelHeader'} />
      ))}
    </>
  );
};

export default Header;
