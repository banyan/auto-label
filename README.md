# auto-label

> GitHub Actions to add labels to Pull Request based on matched file patterns

### Installation

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

And configure by creating `.github/auto-label.json` file. The format is `label: rule`. (`{ [key: string]: string | string[] }`)
Pattern format is following `.gitignore` [spec](https://git-scm.com/docs/gitignore#_pattern_format) using by [node-ignore](https://github.com/kaelzhang/node-ignore).

```json
{
    "rules": {
        "frontend": ["*.js", "*.css", "*.html"],
        "backend": ["app/", "*.rb"],
        "ci": ".circleci",
    }
}
```

### License

MIT
