
import buildNotes from './GitHub.js'
import fs from 'fs'
import mustache from 'mustache'

const myArgs = process.argv
const owner = myArgs[2]
const repositories = myArgs.splice(3)

if (owner == undefined) throw Error("Owner is required")
if (repositories == undefined || repositories.length === 0) throw Error("At least one repository is required")

const today = new Date().toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})

let releaseNotesDoc = {
    owner: owner,
    date: today,
    repositories : []
}

for (const repository of repositories) {
    let notes = await buildNotes(owner, repository)
    releaseNotesDoc.repositories.push(notes)
}

let template = fs.readFileSync("./template.md").toString()
let output = mustache.render(template, releaseNotesDoc)
fs.writeFileSync(`./output/release_notes_${new Date().getTime()}.md`, output)