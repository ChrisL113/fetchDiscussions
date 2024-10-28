const { env } = require("process")

;(async () => {
  const { GraphQLClient, gql } = await import("graphql-request")
  const fs = require("fs")
  const dotenv = require("dotenv")
  dotenv.config()

  const endpoint = "https://api.github.com/graphql"
  const config = {
    token: process.env.TOKEN,
    repositoryName: process.env.REPOSITORYNAME,
    repositoryOwner: process.env.REPOSITORYOWNER,
  }
  const repositoryOwner = "nubedianGmbH" // Replace with the repository owner's username
  const repositoryName = "caseform" // Replace with the repository name

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${config.token}`,
    },
  })

  const query = gql`
  query($after: String) {
    repository(owner: "${config.repositoryOwner}", name: "${config.repositoryName}") {
      discussions(first: 100, after: $after) {
        edges {
          node {
            id
            title
            bodyText
            url
            createdAt
            author {
              login
            }
            comments(first: 100) {
              edges {
                node {
                  bodyText
                  createdAt
                  author {
                    login
                  }
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`

  async function fetchDiscussions(after = null) {
    const variables = { after }
    const data = await graphQLClient.request(query, variables)
    return data.repository.discussions
  }

  async function getAllDiscussions() {
    let discussions = []
    let after = null

    do {
      const discussionsData = await fetchDiscussions(after)
      if (
        !discussionsData ||
        !discussionsData.edges ||
        !discussionsData.pageInfo
      ) {
        break // Stop the loop if discussionsData, edges, or pageInfo are undefined
      }

      const { edges, pageInfo } = discussionsData
      discussions = discussions.concat(edges.map(edge => edge.node))
      after = pageInfo.endCursor

      if (!pageInfo.hasNextPage) {
        break // Stop the loop if there are no more pages
      }
    } while (true)

    return discussions
  }

  ;(async () => {
    try {
      const discussions = await getAllDiscussions()
      fs.writeFileSync("discussions.json", JSON.stringify(discussions, null, 2))
      console.log("Discussions saved to discussions.json")
    } catch (error) {
      console.error("Error fetching discussions:", error)
    }
  })()
})()
