import * as core from '@actions/core';
import pick from 'lodash.pick';

import { Label, LabelName } from './interface';
export const getLabelIds = (allLabels: Label[], labelNames: LabelName[]) =>
  Object.values(pick(allLabels, labelNames));

export const logger = {
  debug: (message: string, object: {} | null | undefined) => {
    return core.debug(`${message}: ${JSON.stringify(object)}`);
  },
  error: (message: string, object: {} | null | undefined) => {
    return core.error(`${message}: ${JSON.stringify(object)}`);
  },
};
