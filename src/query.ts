import * as core from '@actions/core';
import { graphql } from '@octokit/graphql';
import * as OctokitTypes from '@octokit/types';

import { logger } from './util';
import { Label, FileEdge } from './interface';

type Graphql = (
  query: string,
  options?: OctokitTypes.RequestParameters,
) => ReturnType<typeof graphql>;

export const getPullRequestAndLabels = (
  graphqlWithAuth: Graphql,
  {
    owner,
    repo,
    number,
  }: {
    owner: string;
    repo: string;
    number: number;
  },
) => {
  const query = `query pullRequestAndLabels($owner: String!, $repo: String!, $number: Int!) {
    repository(owner:$owner, name:$repo) {
      pullRequest(number:$number) {
        id
        baseRefOid
        headRefOid
        baseRefName
        headRefName
        labels(first: 100) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      labels(first: 100) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }`;

  return graphqlWithAuth(query, {
    owner,
    repo,
    number,
    headers: { Accept: 'application/vnd.github.ocelot-preview+json' },
  });
};

export const getPullRequestFiles = async (
  graphqlWithAuth: Graphql,
  {
    owner,
    repo,
    number,
  }: {
    owner: string;
    repo: string;
    number: number;
  },
) => {
  const query = `query pullRequestFiles($owner: String!, $repo: String!, $number: Int!, $endCursor: String!) {
    repository(owner:$owner, name:$repo) {
      pullRequest(number:$number) {
        files(first: 5, after:$endCursor) {
          edges {
            node {
              path
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }`;

  const diffFiles: string[] = [];
  let hasNextPage = true;
  let endCursor = '';

  while (hasNextPage) {
    try {
      const requestedFiles = await graphqlWithAuth(query, {
        owner,
        repo,
        number,
        endCursor,
        headers: { Accept: 'application/vnd.github.ocelot-preview+json' },
      });

      logger.debug('requestedFiles', requestedFiles);

      if (!requestedFiles) {
        return diffFiles;
      }

      const files = requestedFiles.repository.pullRequest.files;

      files.edges.reduce((acc: string[], edge: FileEdge) => {
        acc.push(edge.node.path);
        return acc;
      }, diffFiles);

      // Set the endCursor so that the next fetch if there is one, grabs the next page
      endCursor = files.pageInfo.endCursor;

      // Terminal conditions for pagination loop
      if (!files.pageInfo.hasNextPage || diffFiles.length > 500) {
        hasNextPage = false;
      }
    } catch (error) {
      if (typeof error === 'function') {
        error();
      }
      core.error(`Request failed: ${JSON.stringify(error.message)}`);
    }
  }

  // Return the accumulated list of files
  return diffFiles;
};

export const addLabelsToLabelable = (
  graphqlWithAuth: Graphql,
  {
    labelIds,
    labelableId,
  }: {
    labelIds: (Label | undefined)[];
    labelableId: string;
  },
) => {
  const query = `
    mutation addLabelsToLabelable($labelIds: [ID!]!, $labelableId: ID!) {
      addLabelsToLabelable(input: {labelIds:$labelIds, labelableId:$labelableId}) {
        clientMutationId
      }
    }`;

  return graphqlWithAuth(query, {
    labelIds,
    labelableId,
    headers: { Accept: 'application/vnd.github.starfire-preview+json' },
  });
};

export const removeLabelsFromLabelable = (
  graphqlWithAuth: Graphql,
  {
    labelIds,
    labelableId,
  }: {
    labelIds: (Label | undefined)[];
    labelableId: string;
  },
) => {
  const query = `
    mutation removeLabelsFromLabelable($labelIds: [ID!]!, $labelableId: ID!) {
      removeLabelsFromLabelable(input: {labelIds:$labelIds, labelableId:$labelableId}) {
        clientMutationId
      }
    }`;

  return graphqlWithAuth(query, {
    labelIds,
    labelableId,
    headers: { Accept: 'application/vnd.github.starfire-preview+json' },
  });
};
