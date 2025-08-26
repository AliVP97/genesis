import { DependencyInjector } from '@780/utils';

import { repository } from './infrastructure/seat-selection.repository';
import { presenter } from './presentation/seat-selection.presenter';
import { View } from './presentation/seat-selection.view';

export const SeatSelection = () =>
  DependencyInjector({
    repository,
    presenter,
    view: View,
  });
