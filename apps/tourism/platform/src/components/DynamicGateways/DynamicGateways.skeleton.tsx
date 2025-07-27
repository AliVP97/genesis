export const PaymentMethodSkeleton = () => {
  return (
    <div className="d-flex p-3 general-box-shadow mt-4 mb-3 rounded-4">
      <div className="d-flex">
        <span className="rounded-circle skeleton" style={{ width: '24px', height: '24px' }} />
      </div>
      <div className="d-flex flex-column flex-grow-1 me-3">
        <span className="skeleton w-25 mb-2 rounded-4" style={{ height: '20px' }} />
        <span className="skeleton w-75 rounded-4" style={{ height: '17px' }} />
      </div>
    </div>
  );
};
