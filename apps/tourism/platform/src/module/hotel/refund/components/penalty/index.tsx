interface IPenaltyItemProps {
  title: string;
  description: string;
}
const PenaltyItem = ({ title, description }: IPenaltyItemProps) => {
  return (
    <>
      <b className="color-red-1">{title}</b>
      <div className="pt-2">
        <span>{description}</span>
      </div>
    </>
  );
};

export default PenaltyItem;
