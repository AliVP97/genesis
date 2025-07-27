interface Props {
  label: string;
  data?: string | number;
  price?: boolean;
}

const formatData = (data: string | number | undefined) => {
  return data ? data : '--';
};

export const rowDetail = ({ label, data, price = false }: Props) => {
  return price ? (
    <div className="pb-3">
      <span className="color-grey-1 text-2">{label}:</span>
      <div className="color-black">
        <span className="text-3">{parseInt(data as string)?.toLocaleString()}</span>
        <span className="text-2"> ریال</span>
      </div>
    </div>
  ) : (
    <div className="pb-2">
      <div className="color-grey-1 text-2">{label}:</div>
      <div className="color-black">{formatData(data)}</div>
    </div>
  );
};
