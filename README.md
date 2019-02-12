# auto-label

> A GitHub action to add labels to Pull Request based on matched file patterns

## Installation

To configure the action simply add the following lines to your `.github/main.workflow` workflow file:

```
workflow "auto-label" {
  on = "pull_request"
  resolves = ["Auto label"]
}

action "Auto label" {
  uses = "banyan/auto-label@master"
  secrets = ["GITHUB_TOKEN"]
}
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
    "ci": ".circleci",
  }
}
```

## Features

* Remove label in the PR if the file has been removed.
* If there's no adding / removing labels, it will only consumes 1 point of rate limit score.
  * https://developer.github.com/v4/guides/resource-limitations/

### TODO

* Handle pagination of label (currently only handles 100)

## License

MIT
