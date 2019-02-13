import { pick } from 'lodash';
import { Label, LabelName } from './interface';

export const getLabelIds = (
  allLabels: Label[],
  labelNames: LabelName[],
): string => JSON.stringify(Object.values(pick(allLabels, labelNames)));
