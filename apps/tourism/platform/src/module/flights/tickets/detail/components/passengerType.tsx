export const renderPassengerType = (
  title: string,
  description: string,
  count: number,
  price: number,
) => {
  if (count !== 0) {
    return (
      <div className="d-flex justify-content-between align-items-center my-2">
        <div className="color-grey-1">
          <span className="text-3">{title}</span>
          <span className="text-2 m-1">{description}</span>
        </div>

        <div dir="rtl" className="d-flex align-items-center">
          <span className="color-tertiary text-weight-bold text-3 ms-1">x {count}</span>
          <span className="color-grey-1">
            {price && (+price).toLocaleString()} <span className="text-2">ریال</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};
