import fetch from 'node-fetch';

const email = process.env.JIRA_AUTH_EMAIL
const token = process.env.JIRA_AUTH_TOKEN

export default async function buildIssueObject(owner, key) {
    const url = `https://${owner}.atlassian.net/rest/agile/1.0/issue/${key}?fields=key&fields=customfield_10131&fields=summary&fields=assignee&fields=status`
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(email + ":" + token).toString('base64')}`,
            'Accept': 'application/json'
        }
    })
    if (response.status != 200) {
        console.log(`Error looking up issue ${key} in Jira`)
        return null
    }

    let data = await response.text()
    let jiraObject = JSON.parse(data)
    let assigneeName = null
    let status = null
    let release_note_text = null
    if (jiraObject.fields.assignee) {
        assigneeName = jiraObject.fields.assignee.displayName
    }
    if (jiraObject.fields.status) {
        status = jiraObject.fields.status.name
    }
    if (jiraObject.fields.customfield_10131) {
        release_note_text = jiraObject.fields.customfield_10131
    }

    return {
        key: jiraObject.key,
        summary: jiraObject.fields.summary,
        release_note_text: release_note_text,
        assignee: assigneeName,
        status: status
    }
}