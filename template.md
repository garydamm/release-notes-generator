# {{owner}} Release Notes {{date}}

{{#repositories}}
## {{repository}} 
latest: {{latest_tag}} previous: {{previous_tag}}

{{#commits}}
***
### GitHub Commit [{{sha}}](https://github.com/{{owner}}/{{repository}}/commit/{{sha}})
message: {{message}}

author: {{author}}
{{#jira_issues}}
#### Jira Issue [{{key}}](https://{{owner}}.atlassian.net/browse/{{key}})
summary: {{summary}}

release note: {{release_note_text}}

assignee: {{assignee}}

status: {{status}}
{{/jira_issues}}
{{/commits}}

{{/repositories}}