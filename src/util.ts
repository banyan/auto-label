import pick from 'lodash.pick';
import { Label, LabelName } from './interface';

export const getLabelIds = (
  allLabels: Label[],
  labelNames: LabelName[],
): string => JSON.stringify(Object.values(pick(allLabels, labelNames)));
