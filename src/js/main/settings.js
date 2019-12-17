
const settings = {
    github: {
        githubModel: {
            // githubClientID: "ba0ddf32ca96a00459cb", 
            // redirectURI : "http://localhost:8080/oauth/redirect",
            githubClientID: "51e2ade66c8419a6fbc1", 
            redirectURI : "https://news-startpage.herokuapp.com/oauth/redirect",
            scope: "notifications", 
            per_page: 20, 
        },
    },
    reddit: {
        redditModel: {
            clientID: '3a4tN3IjI4Ra9Q'
        },
    },
    anyWebsite: {
    }

}



module.exports = settings