import { graphql } from '@octokit/graphql';
import * as OctokitTypes from '@octokit/types';

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

export const addLabelsToLabelable = (
  graphqlWithAuth: Graphql,
  {
    labelIds,
    labelableId,
  }: {
    labelIds: string;
    labelableId: string;
  },
) => {
  const query = `
    mutation addLabelsToLabelable($labelIds: String!, $labelableId: String!) {
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
    labelIds: string;
    labelableId: string;
  },
) => {
  const query = `
    mutation removeLabelsFromLabelable($labelIds: String!, $labelableId: String!) {
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
