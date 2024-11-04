const fs = require("fs")
const path = require("path")
const folderPath = "./discussions_by_category"

const args = process.argv.slice(2)
let wordToSearch = null
function showHelp() {
  console.log(`
Usage:
  node searchScript.js -w <word>
Options:
  -w <word>    Specify the word to search for in "title" and "bodytext" fields.
  -h           Show this help message.
`)
}
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-w" && args[i + 1]) {
    wordToSearch = args[i + 1]
    i++
  } else if (args[i] === "-h") {
    showHelp()
    process.exit(0)
  }
}
if (!wordToSearch) {
  console.error(
    'Error: Please provide a word to search for using the "-w" flag.'
  )
  showHelp()
  process.exit(1)
}

function searchWordInJson(jsonArray, word) {
  const lowerCaseWord = word.toLowerCase()

  return jsonArray.filter(item => {
    const titleContainsWord =
      item.title && item.title.toLowerCase().includes(lowerCaseWord)
    const bodytextContainsWord =
      item.bodyText && item.bodyText.toLowerCase().includes(lowerCaseWord)
    return titleContainsWord || bodytextContainsWord
  })
}
function searchWordInFolder(folderPath, word) {
  const results = []
  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(folderPath, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      try {
        const jsonData = JSON.parse(fileContent)

        const matchedItems = searchWordInJson(jsonData, word)
        if (matchedItems.length > 0) {
          results.push(...matchedItems)
        }
      } catch (error) {
        console.error(`Error parsing JSON in file ${file}:`, error)
      }
    }
  })
  return results
}
const searchResults = searchWordInFolder(folderPath, wordToSearch)
const mapped = searchResults.map(item => ({
  title: item.title,
  url: item.url,
  category: item.category.name
}))
console.log(mapped)
