# release-notes-generator

Used to generate a markdown document of release notes from one or more GitHub repositories.

It finds the latest production (**draft=false** and **prerelease=false**) tag and previous production tag and lists all commits.

For each commit it parses out any Jira keys and then looks up the Jira issue.

For each commit and issue it provides a link plus other data in a markdown document in the **output** directory.

## Requirements
- Node JS
- NPM

### Environment Variables
- GITHUB_AUTH_TOKEN (A Github access token that has permissions to the repositories)
- JIRA_AUTH_TOKEN (A Jira access token that has permissions to the projects)
- JIRA_AUTH_EMAIL (The Jira email associated to the access token)

#### Optional (to publish to Confluence)
- CONFLUENCE_SPACE_KEY (The space key you want to publish to)
- CONFLUENCE_PARENT_PAGE_ID (An optional parent page you want to use)

### Command Line Execution

    >node ReleaseNotes.js <github_owner> <repository_1> <repository_2> <repository_n>

