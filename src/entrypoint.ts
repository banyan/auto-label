import * as core from '@actions/core';
import * as github from '@actions/github';
import { graphql } from '@octokit/graphql';
import Webhooks from '@octokit/webhooks';
import ignore from 'ignore';

import { logger, getLabelIds } from './util';
import { Label, LabelEdge, LabelName } from './interface';
import {
  addLabelsToLabelable,
  removeLabelsFromLabelable,
  getPullRequestAndLabels,
  getPullRequestFiles,
} from './query';

async function run() {
  try {
    const token = process.env['GITHUB_TOKEN'];
    if (!token) {
      core.setFailed('GITHUB_TOKEN does not exist.');
      return;
    }

    const graphqlWithAuth = graphql.defaults({
      headers: { authorization: `token ${token}` },
    });

    const rules = JSON.parse(core.getInput('rules'));

    logger.debug('rules', rules);
    logger.debug('github.context.eventName', github.context.eventName);

    if (github.context.eventName !== 'pull_request') {
      return;
    }

    const payload = github.context
      .payload as Webhooks.WebhookPayloadPullRequest;

    logger.debug('payload.action', payload.action);

    if (payload.action !== 'opened' && payload.action !== 'synchronize') {
      return;
    }

    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const number = payload.pull_request.number;

    let result;

    try {
      result = await getPullRequestAndLabels(graphqlWithAuth, {
        owner,
        repo,
        number,
      });
    } catch (error) {
      error();
      core.error(`Request failed: ${JSON.stringify(error.message)}`);
      core.setFailed('getPullRequestAndLabels has been failed.');
    }

    logger.debug('result', result);

    if (!result) {
      return core.setFailed(`result was empty: ${result}`);
    }

    const allLabels = result.repository.labels.edges.reduce(
      (acc: Label, edge: LabelEdge) => {
        acc[edge.node.name] = edge.node.id;
        return acc;
      },
      {},
    );

    logger.debug('allLabels', allLabels);

    const currentLabelNames = new Set(
      result.repository.pullRequest.labels.edges.map(
        (edge: LabelEdge) => edge.node.name,
      ),
    );

    logger.debug('currentLabelNames', Array.from(currentLabelNames));

    const diffFiles = await getPullRequestFiles(graphqlWithAuth, {
      owner,
      repo,
      number,
    });

    if (!diffFiles) {
      return core.setFailed(`requestedFiles was empty: ${diffFiles}`);
    }

    const newLabelNames = new Set(
      diffFiles.reduce((acc: LabelName[], file: string) => {
        Object.entries(rules).forEach(([label, pattern]) => {
          if (
            ignore()
              .add(pattern as string)
              .ignores(file)
          ) {
            acc.push(label);
          }
        });
        return acc;
      }, []),
    );

    logger.debug('newLabelNames', newLabelNames);

    const ruledLabelNames = new Set(Object.keys(rules));

    const labelNamesToAdd = new Set(
      ([...newLabelNames] as LabelName[]).filter(
        labelName => !currentLabelNames.has(labelName),
      ),
    );

    const labelNamesToRemove = new Set(
      ([...currentLabelNames] as LabelName[]).filter(
        (labelName: string) =>
          !newLabelNames.has(labelName) && ruledLabelNames.has(labelName),
      ),
    );

    logger.debug('ruledLabelNames', Array.from(ruledLabelNames));
    logger.debug('labelNamesToAdd', Array.from(labelNamesToAdd));
    logger.debug('labelNamesToRemove', Array.from(labelNamesToRemove));

    const labelableId = result.repository.pullRequest.id;

    logger.debug('labelableId', labelableId);

    if (labelNamesToAdd.size > 0) {
      try {
        await addLabelsToLabelable(graphqlWithAuth, {
          labelIds: getLabelIds(allLabels, [...labelNamesToAdd] as LabelName[]),
          labelableId,
        });
        console.log('Added labels: ', labelNamesToAdd);
      } catch (error) {
        logger.error('Request failed', error.message);
        core.setFailed('addLabelsToLabelable has been failed. ');
      }
    }

    if (labelNamesToRemove.size > 0) {
      try {
        await removeLabelsFromLabelable(graphqlWithAuth, {
          labelIds: getLabelIds(allLabels, [
            ...labelNamesToRemove,
          ] as LabelName[]),
          labelableId,
        });
        console.log('Removed labels: ', labelNamesToRemove);
      } catch (error) {
        logger.error('Request failed', error.message);
        core.setFailed('removeLabelsFromLabelable has been failed. ');
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
