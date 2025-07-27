interface TTicketContentItemProps {
  title: string;
  value: string;
}
const TicketContentItem = ({ title, value }: TTicketContentItemProps) => {
  return (
    <>
      <div className="d-flex color-grey-1 justify-content-between">
        <div className="pb-3">
          <span>{title}</span>
        </div>
        <div className="pb-3">
          <span>{value}</span>
        </div>
      </div>
    </>
  );
};

export default TicketContentItem;
