const path = require("path")

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === "develop-html" || stage === "build-html") {
    actions.setWebpackConfig({
      resolve: {
        mainFields: ["main"],
      },
    })
  } else {
    actions.setWebpackConfig({
      resolve: {
        mainFields: ["browser", "module", "main"],
      },
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const bookTemplate = path.resolve("src/templates/bookTemplate.js")

  //query the database and return the results. As the graphql returns a promise once the query resolves, 
  //use .then to check the results. If there were any errors dont create pages and throw the error
  return graphql(`
    {
    allBook {
      edges {
        node {         
          id
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }

    //If there are no errors loop through the edges of the query i.e books and create the pages foreach book
    // passing in he path, bookTemplate and context
    result.data.allBook.edges.forEach(book => {
      createPage({
        path: `/book/${book.node.id}`,
        component: bookTemplate,
        context: {bookId: book.node.id}
      })
    })
  })
}