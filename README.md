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
      - uses: actions/checkout@v2
      - uses: banyan/auto-label@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

And configure by creating `.github/auto-label.json` file.
The format is `label: rule`:

```ts
{ [key: string]: string | string[] }
```

Pattern matching is following `.gitignore` [spec](https://git-scm.com/docs/gitignore#_pattern_format) using by [node-ignore](https://github.com/kaelzhang/node-ignore).

```json
{
  "rules": {
    "frontend": ["*.js", "*.css", "*.html"],
    "backend": ["app/", "*.rb"],
    "ci": ".circleci"
  }
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

## License

MIT
