import {Octokit} from "octokit";
import buildJiraObject from './Jira.js'

const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
})

export default async function buildNotes(owner, repository) {
    if (owner == undefined) throw Error("Owner is required")
    if (repository == undefined) throw Error("Repository is required")
    let notes = {
        repository: repository,
        latest_tag: null,
        previous_tag: null,
        commits: []
    }
    let compareString = await buildCompareString(owner, repository, notes)
    let messages = await commitMessages(owner, repository, compareString)
    notes.commits = messages
    return notes
}

async function buildCompareString(owner, repository, notes) {
    let releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
        owner: owner,
        repo: repository
    })

    let latest
    let previous
    releases.data.forEach((release, i) => {
        if (release.draft == false && release.prerelease == false) {
            if (latest == null) {
                latest = release.tag_name
            } else if (previous == null) {
                previous = release.tag_name
            }
        }
    })
    if (latest == undefined) throw Error("Could not find latest release")
    if (previous == undefined) throw Error("Could not find previous release")
    notes.latest_tag = latest
    notes.previous_tag = previous
    return previous + "..." + latest
}

async function commitMessages(owner, repository, compareString) {

    let notes = []

    let commits = await octokit.request('GET /repos/{owner}/{repo}/compare/' + compareString, {
        owner: owner,
        repo: repository
    })

    for (const commit of commits.data.commits) {
        let commitObject = await buildCommitObject(owner, commit)
        notes.push(commitObject)
    }

    return notes
}

async function buildCommitObject(owner, commit) {
    let commitMessage = commit.commit.message
    let jiraKeys = extractJiraKey(commit.commit.message)
    let jiraIssues = []
    if (isIterable(jiraKeys)) {
        for (const key of jiraKeys) {
            let jiraObject = await buildJiraObject(owner,key)
            jiraIssues.push(jiraObject)
        }
    }
    let commitObject = {
        sha: commit.sha,
        message: commitMessage,
        author: commit.commit.author.name,
        jira_keys: jiraKeys,
        jira_issues: jiraIssues
    }
    return commitObject
}

function extractJiraKey(message) {
    let jira_matcher = /([A-Z][A-Z0-9]+-[0-9]+)/g
    return message.match(jira_matcher)
}

function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}


