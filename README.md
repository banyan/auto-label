# auto-label

> A GitHub action to add labels to Pull Request based on matched file patterns

## Installation

To configure the action simply add the following lines to your `.github/workflows/auto-label.yml` file:

```yaml
name: Auto Label
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-label:
    name: Auto Label
    runs-on: ubuntu-latest
    steps:
      - uses: banyan/auto-label@1.2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          rules: >
            {
              "actions": [".github/"],
              "frontend": ["*.css", "*.html", "*.js"],
              "backend": ["app/", "*.rb"],
              "ci": [".circleci"]
            }
```

NOTE: `pull_request` event is triggered by [many actions](https://developer.github.com/v3/activity/events/types/#pullrequestevent), so please make sure to filter by `[opened, synchronize]` of [on.<event_name>.types](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#onevent_nametypes) as in the example above.

The format for the `rules` configuration is `label: rule`:

```ts
{ [key: string]: string | string[] }
```

Pattern matching is following `.gitignore` [spec](https://git-scm.com/docs/gitignore#_pattern_format) using by [node-ignore](https://github.com/kaelzhang/node-ignore).

```yaml
    rules: >
      {
        "actions": [".github/"],
        "frontend": ["*.css", "*.html", "*.js"],
        "backend": ["app/", "*.rb"],
        "ci": [".circleci"]
      }
```

## Features

* Remove label in the PR if the file has been removed.
* If there's no adding / removing labels, it will only consumes 1 point of rate limit score.
  * https://developer.github.com/v4/guides/resource-limitations/

## Tips

* In case if you want to debug the response quickly, just set `ACTIONS_STEP_DEBUG` as `true` on Secrets from Settings of GitHub.

### TODO

* Handle pagination of label (currently only handles 100)
