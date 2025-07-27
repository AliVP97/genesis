import { cmsBlockToComponentMapper } from './components';
import { ComponentError } from './error-components/error';
import * as Sentry from '@sentry/nextjs';
import { Blocks, DataApiResponse } from './services/type';
import { BlockToComponentModel } from './types/types';

type ReusableBlockObject = {
  id: string;
  path: string;
  [key: string]: unknown; // other dynamic props
};
const resolvedBlockComponent = (block: Blocks) => {
  let blockObject: Blocks | ReusableBlockObject = { ...block };
  let Component = cmsBlockToComponentMapper[block.component];

  if (block.component === 'blocks.reusable-block-reference') {
    const reusableBlockType = block.reusable_block ? block.reusable_block.type : '';

    const componentKey = reusableBlockType?.split('.').pop();
    const reusableBlockObj = componentKey ? block.reusable_block?.[componentKey] : undefined;

    if (reusableBlockObj && typeof reusableBlockObj === 'object') {
      const reusableBlock = reusableBlockObj as ReusableBlockObject;
      reusableBlock.component = reusableBlockType?.replace(/_/g, '-') || reusableBlock.component;
      Component = cmsBlockToComponentMapper[reusableBlock.component as keyof BlockToComponentModel];
      blockObject = { ...reusableBlock };
    }
  }

  return { Component, blockObject };
};

const componentFactory = <T extends Blocks>(block: T) => {
  const { Component, blockObject } = resolvedBlockComponent(block);
  return Component ? <Component key={block.id} {...blockObject} /> : <ComponentError />;
};

export const cmsFactory = ({ cmsData }: { cmsData: DataApiResponse | null }) => {
  try {
    return cmsData ? (
      cmsData?.blocks?.map((block: Blocks) => componentFactory(block))
    ) : (
      <ComponentError />
    );
  } catch (error) {
    Sentry?.captureException(error);
    return <ComponentError />;
  }
};
