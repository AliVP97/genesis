type TableColKeys =
  | 'empty'
  | 'visaType'
  | 'visaPrice'
  | 'processTime'
  | 'tenDays'
  | 'oneMonth'
  | 'twoMonths';

type TableCols = {
  id?: number;
  key: TableColKeys;
  label: string;
};

type TableRows = {
  id?: number;
  empty?: string;
  visaType?: string;
  visaPrice?: string;
  processTime?: string;
  tenDays?: string;
  oneMonth?: string;
  twoMonths?: string;
};

export type VisaPriceTableItemProps = {
  title?: string;
  columns?: Array<TableCols>;
  rows?: Array<TableRows>;
};

export type VisaPriceTableProps = {
  title?: string;
  items?: Array<VisaPriceTableItemProps>;
};
