export default interface AnchorOrigin {
  horizontal: AnchorHorizontal;
  vertical: AnchorVertical;
  offset?: Partial<AnchorOffset>;
}

export interface AnchorOffset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type AnchorHorizontal = 'center' | 'left' | 'right';

export type AnchorVertical = 'bottom' | 'center' | 'top';
