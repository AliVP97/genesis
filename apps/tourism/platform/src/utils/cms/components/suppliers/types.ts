export type SupplierItemProps = {
  title?: string;
  link?: string;
  image?: {
    url: string;
  };
};

export type SuppliersProps = {
  title?: string;
  items?: Array<SupplierItemProps>;
};
