const fs = require("fs")
const path = require("path")
const folderPath = "./discussions_by_category"

const args = process.argv.slice(2)
let patternToSearch = null
let searchInComments = false
let categoryToFilter = null
let categoryToFilterOut = null
function showHelp() {
  console.log(`
Usage:
  node searchScript.js -p <pattern>
Options:
  -p <pattern>     Specify the pattern to search for in "title" and "bodytext" fields.
  -cat <category>  Limit Search to items within a category in specific.
  -ncat <category> Skip a category in specific.
  -h               Show this help message.
  -c               Enable search in the comments
`)
}
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-p" && args[i + 1]) {
    patternToSearch = args[i + 1]
    i++
  } else if (args[i] === "-cat" && args[i + 1]) {
    categoryToFilter = args[i + 1]
    i++
  } else if (args[i] === "-ncat" && args[i + 1]) {
    categoryToFilterOut = args[i + 1]
    i++
  } else if (args[i] === "-c") {
    searchInComments = true
  } else if (args[i] === "-h") {
    showHelp()
    process.exit(0)
  }
}

if (!patternToSearch) {
  console.error(
    'Error: Please provide a pattern to search for using the "-p" flag.'
  )
  showHelp()
  process.exit(1)
}

function searchPatternInJson(
  jsonArray,
  pattern,
  searchComments,
  category,
  nocategory
) {
  const lowerCasePattern = pattern.toLowerCase()

  return jsonArray.filter(item => {
    if (
      (category && !item.category.name.toLowerCase().includes(category)) ||
      (nocategory && item.category.name.toLowerCase().includes(nocategory))
    ) {
      return
    }

    const titleContainsPattern =
      item.title && item.title.toLowerCase().includes(lowerCasePattern)
    const bodytextContainsPattern =
      item.bodyText && item.bodyText.toLowerCase().includes(lowerCasePattern)
    let commentsContainPattern = false
    if (
      searchComments &&
      item.comments.edges &&
      Array.isArray(item.comments.edges)
    ) {
      commentsContainPattern = item.comments.edges.some(comment => {
        return comment.node.bodyText.toLowerCase().includes(lowerCasePattern)
      })
    }

    return (
      titleContainsPattern || bodytextContainsPattern || commentsContainPattern
    )
  })
}
function searchPatternInFolder(
  folderPath,
  pattern,
  searchComments,
  category,
  nocategory
) {
  const results = []
  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(folderPath, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      try {
        const jsonData = JSON.parse(fileContent)

        const matchedItems = searchPatternInJson(
          jsonData,
          pattern,
          searchComments,
          category,
          nocategory
        )
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
const searchResults = searchPatternInFolder(
  folderPath,
  patternToSearch,
  searchInComments,
  categoryToFilter,
  categoryToFilterOut
)
const mapped = searchResults.map(item => ({
  title: item.title,
  url: item.url,
  category: item.category.name,
}))
console.log(mapped)
