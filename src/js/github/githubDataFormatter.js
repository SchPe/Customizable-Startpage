

export default class GithubDataFormatter {

    constructor() {}

    formatData({res, graphQL}) {


        graphQL = shortenGraphQLRes(graphQL)


        var compoundArray = [];
        compoundArray.length = length;
        let i, url, hasBody;
        for(i = 0; i<res.data.length; i++) {
            url = determineURL(res.data[i].subject.url, res.data[i].subject.type )
            if(graphQL[`${'n' + i}`] == null) graphQL[`${'n' + i}`] = {}
            hasBody = graphQL[`${'n' + i}`] == null || graphQL[`${'n' + i}`].bodyHTML == null || graphQL[`${'n' + i}`].bodyHTML === ""
            compoundArray[i] = {title:res.data[i].subject.title, type:res.data[i].subject.type, bodyHTML:graphQL[`${'n' + i}`].bodyHTML, url, hasBody, repo: res.data[i].repository.name, id:res.data[i].id  }
        }

        return {content: compoundArray, status: res.status, link: res.headers.get('link'), headers: res.headers }     
            
    }
}



function shortenGraphQLRes(graphQL) {
    var graphqlWork = {}; 
    for (var prop in graphQL.data) {
        if(!graphQL.data.hasOwnProperty(prop)) continue;
        if(typeof graphQL.data[prop].issue === "undefined") {
            graphqlWork[prop] = graphQL.data[prop].pullRequest;
        }
        else {
            graphqlWork[prop] = graphQL.data[prop].issue;
        }
    }
    return graphqlWork
}



function determineURL(url, type) {
    if(type === "PullRequest" ||  type === "Issue" || type === "Commit") {
        url = "https://github.com/" + /https:\/\/api.github.com\/repos\/(.*)/.exec(url)[1]
        url = url.replace(/(pull)s(\/\w+)\/?$/, "$1$2")
        url = url.replace(/(commit)s(\/\w+)\/?$/, "$1$2")
    }
    else url = '#'
    return url;
}
