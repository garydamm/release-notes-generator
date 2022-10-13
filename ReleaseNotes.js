
import buildNotes from './GitHub.js'
import fs from 'fs'
import mustache from 'mustache'
import createDocument from './Confluence.js'

const myArgs = process.argv
const owner = myArgs[2]
const repositories = myArgs.splice(3)

if (owner == undefined) throw Error("Owner is required")
if (repositories == undefined || repositories.length === 0) throw Error("At least one repository is required")

const today = new Date().toLocaleString()
const capitalizedOwner = capitalizeFirstLetter(owner)
const title = `${capitalizedOwner} Release Notes ${today}`

let releaseNotesDoc = {
    owner: owner,
    title: title,
    repositories : []
}

for (const repository of repositories) {
    let notes = await buildNotes(owner, repository)
    releaseNotesDoc.repositories.push(notes)
}

let markdownTemplate = fs.readFileSync("./template.md").toString()
let htmlTemplate = fs.readFileSync("./template.html").toString()

let markdownOutput = mustache.render(markdownTemplate, releaseNotesDoc)
let htmlOutput = mustache.render(htmlTemplate, releaseNotesDoc)

let outputDir = './output';

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}
fs.writeFileSync(`${outputDir}/release_notes_${new Date().getTime()}.md`, markdownOutput)
fs.writeFileSync(`${outputDir}/release_notes_${new Date().getTime()}.html`, htmlOutput)

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

createDocument(owner, title, htmlOutput)