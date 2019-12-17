import {makeId} from '../util/helper.js'


var gitHubtoken;
const settings = require('../main/settings.js').github.githubModel
const githubString = 'github'
const localStorageKeys = {cachebust:'mast253' + githubString, githubToken: 'githubToken2346' + githubString}

export default class GithubModel {

constructor() {

}

githubAuth() {
    window.location.replace(`https://github.com/login/oauth/authorize?client_id=${settings.githubClientID}&redirect_uri=${settings.redirectURI}&scope=${settings.scope}`);
}

async getContent({owner, repo}) {
    this.handleAuthToken()
    return loadMore({owner, repo});
}

async getMoreContent({owner, repo, link}){
    this.handleAuthToken()
    link = /^<([^<>]+)>/.exec(link)[1]
    return loadMore({owner, repo, link});
}

handleAuthToken() {
    const params = new URLSearchParams(window.location.search);
    if(params.has("github") && params.has("access_token")) {
        window.localStorage.setItem(localStorageKeys.githubToken, params.get("access_token"));
    }
    gitHubtoken = window.localStorage.getItem(localStorageKeys.githubToken);
    if(gitHubtoken === null) throw new Error('401')
}




async markAllAsRead({owner, repo, lastRead}) {
    let fetchUrl;
    if(repo === '')  fetchUrl = `https://api.github.com/notifications?last_read_at=${lastRead}`
    else fetchUrl = `https://api.github.com/repos/${owner}/${repo}/notifications?last_read_at=${lastRead}`
        await fetch(fetchUrl, {
            method: 'Put',
            headers: {
                'Authorization': "token " + gitHubtoken,    
                'Accept': 'application/vnd.github.v3+json',
        }});
}


async markAsRead({threadID}) {
    await fetch(`https://api.github.com/notifications/threads/${threadID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': "token " + gitHubtoken,    
            'Accept': 'application/vnd.github.v3+json',
        }
    });   
}

}



async function loadMore({owner, repo, link}) {
    
    let cachebust = window.localStorage.getItem(localStorageKeys.cachebust) ||  makeId(5, true);
    const fetchUrl = determineFetchUrl({owner, repo, link, cachebust})
    window.localStorage.setItem(localStorageKeys.cachebust, parseInt(cachebust)+1);

        try{
            var res = await fetch(fetchUrl, {
                    method: 'Get',
                    headers: {
                        'Authorization': "token " + gitHubtoken,    
                        'Accept': 'application/vnd.github.v3+json',
                    }
            });
        } catch(error) {throw new Error("Couldn't get notifications. Make sure repository URL is correct and you're connected to the Internet")}

        res.data = await res.json();

        if(res.data.id == "anything and nothing") {
            throw new Error("Couldn't get notifications. Make sure repository URL is correct and you're connected to the Internet")
        }
        if(res.data.length==0) throw new Error("No new notifications")

    let graphQL = await fetchGraphQL(createGraphQLQuery(res.data)) 
    
    return {res, graphQL}
}



function createGraphQLQuery(data) {
    let graphqlQuery = "", type, number, i;
    for(i = 0; i<data.length; i++) {
        if(data[i].subject.type === "Issue" || data[i].subject.type === "PullRequest") {
            number = /\/(\d*)$/.exec(data[i].subject.url)[1]
            data[i].subject.type === "Issue" ? type = "issue" : type = "pullRequest"; 
            graphqlQuery += 
            `${'n' + i}: repository (owner: "${data[i].repository.owner.login}", name:"${data[i].repository.name}"){
                ${type}(number: ${number}) {
                    bodyHTML
                }
            }`;
        }
    }
    return graphqlQuery
}

async function fetchGraphQL(graphqlQuery) {
    let graphQL = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': "token " + gitHubtoken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ query: '{' + graphqlQuery + '}' })
    });
    graphQL = await graphQL.json();
    if(graphQL.id=="anything and nothing") throw new Error("No Internet")
    return graphQL
}




function determineFetchUrl({owner, repo, link, cachebust}) {
    let fetchUrl
    if(link != null) fetchUrl = link
    else if(repo === "") fetchUrl = `https://api.github.com/notifications?per_page=${settings.per_page}&cachebust=${cachebust}`
    else fetchUrl = `https://api.github.com/repos/${owner}/${repo}/notifications?per_page=${settings.per_page}&cachebust=${cachebust}`
    return fetchUrl
}

