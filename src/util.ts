import { pick, values } from 'lodash';
import { Label, LabelName } from './interface';

export const getLabelIds = (
  allLabels: Label[],
  labelNames: LabelName[],
): string => JSON.stringify(values(pick(allLabels, labelNames)));
