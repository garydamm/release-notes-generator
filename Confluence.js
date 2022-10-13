import fetch from 'node-fetch';

const email = process.env.JIRA_AUTH_EMAIL
const token = process.env.JIRA_AUTH_TOKEN

const parentPageID = process.env.CONFLUENCE_PARENT_PAGE_ID
const spaceKey = process.env.CONFLUENCE_SPACE_KEY

export default async function createDocument(owner, title, html) {

    if (!spaceKey) {
        console.log("Need a Space Key to create a Confluence page")
        return
    }

    const url = `https://${owner}.atlassian.net/wiki/rest/api/content`
    let ancestors = ""
    if (parentPageID) {
        ancestors = `,"ancestors" : [{"type":"page","id":"${parentPageID}"}]`
    }
    let htmlWithNewlinesRemoved = html.replace(/\r?\n|\r/g, "")
    const body = `{"type": "page", "title": "${title}","space": {"key": "${spaceKey}" } ${ancestors}, "body": {"storage": {"value": "${htmlWithNewlinesRemoved}","representation": "storage"}}}`

    let response = await fetch(url, {
        method: 'POST',
        body: body,
        headers: {
            'Authorization': `Basic ${Buffer.from(email + ":" + token).toString('base64')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    if (response.status != 200) {
        console.log(`Error creating Confluence page status: ${response.status}`)
        const data = await response.text()
        console.log(`Error message: ${data}`)
    }
}