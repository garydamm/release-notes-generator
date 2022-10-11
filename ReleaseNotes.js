
import buildNotes from './GitHub.js'
import util from 'util'

const myArgs = process.argv
const owner = myArgs[2]
const repositories = myArgs.splice(3)

if (owner == undefined) throw Error("Owner is required")
if (repositories == undefined || repositories.length === 0) throw Error("At least one repository is required")

let releaseNotesDoc = {
    owner: owner,
    repositories : []
}

for (const repository of repositories) {
    let notes = await buildNotes(owner, repository)
    releaseNotesDoc.repositories.push(notes)
}

console.log(util.inspect(releaseNotesDoc, false, null, true /* enable colors */))