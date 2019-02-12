import { Toolkit } from 'actions-toolkit';
import { LabelName } from './interface';

export const getPullRequestAndLabels = (
  tools: Toolkit,
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
  const query = `{
    repository(owner: "${owner}", name: "${repo}") {
      pullRequest(number: ${number}) {
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

  return tools.github.graphql(query, {
    headers: { Accept: 'application/vnd.github.ocelot-preview+json' },
  });
};

export const addLabelsToLabelable = (
  tools: Toolkit,
  {
    labelIds,
    labelableId,
  }: {
    labelIds: string;
    labelableId: string;
  },
) => {
  const query = `
    mutation {
      addLabelsToLabelable(input: {labelIds: ${labelIds}, labelableId: "${labelableId}"}) {
        clientMutationId
      }
    }`;

  return tools.github.graphql(query, {
    headers: { Accept: 'application/vnd.github.starfire-preview+json' },
  });
};

export const removeLabelsFromLabelable = (
  tools: Toolkit,
  {
    labelIds,
    labelableId,
  }: {
    labelIds: string;
    labelableId: string;
  },
) => {
  const query = `
    mutation {
      removeLabelsFromLabelable(input: {labelIds: ${labelIds}, labelableId: "${labelableId}"}) {
        clientMutationId
      }
    }`;

  return tools.github.graphql(query, {
    headers: { Accept: 'application/vnd.github.starfire-preview+json' },
  });
};
