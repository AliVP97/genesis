import { BlockToComponentModel } from '../types/types';
export type ReusableBlocks = {
  [key: string]: string;
  component: string;
};
export type Blocks = {
  component: keyof BlockToComponentModel;
  id: string;
  path: string;
  reusable_block?: ReusableBlocks;
};

export type DataApiResponse = {
  id: number;
  service: string;
  path: string;
  title: string;
  blocks: Array<Blocks>;
  error?: unknown;
};
export type ApiResponse = {
  data: DataApiResponse;
};
