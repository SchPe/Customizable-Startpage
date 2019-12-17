import RedditController from '../reddit/redditController.js'
import NewsController from '../news/newsController.js'
import AnyWebsiteController from '../anyWebsite/anyWebsiteController.js'
import GithubController from '../github/githubController.js'
import DefaultController from '../default/defaultController.js'

import RedditView from '../reddit/redditView.js'
import NewsView from '../news/newsView.js'
import AnyWebsiteView from '../anyWebsite/anyWebsiteView.js'
import GithubView from '../github/githubView.js'
import DefaultView from '../default/defaultView.js'

import RedditQueryView from '../reddit/redditQueryView.js'
import NewsQueryView from '../news/newsQueryView.js'
import AnyWebsiteQueryView from '../anyWebsite/anyWebsiteQueryView.js'
import GithubQueryView from '../github/githubQueryView.js'


import {countries} from '../data/countries.js'


export const viewTypes = {
    reddit: 'reddit',
    github: 'github',
    anyWebsite: 'anyWebsite',
    news: 'news',
    default: 'default'
}


export const controllerConstructorMap = {
    [viewTypes.reddit]: () => new RedditController(), 
    [viewTypes.news]: () => new NewsController(), 
    [viewTypes.github]: () => new GithubController(), 
    [viewTypes.anyWebsite]: () => new AnyWebsiteController(),
    [viewTypes.default]: () => new DefaultController()
}

export const desktopContentViewConstructorMap = {
    [viewTypes.reddit]: (e, id) => new RedditView(e, id), 
    [viewTypes.github]: (e, id) => new GithubView(e, id), 
    [viewTypes.anyWebsite]: (e, id) => new AnyWebsiteView(e, id), 
    [viewTypes.news]: (e, id) => new NewsView(e, id),
    [viewTypes.default]: (e, id) => new DefaultView(e, id)
}

export const queryViewConstructorMap = {
    [viewTypes.reddit]: (e) => new RedditQueryView(e), 
    [viewTypes.github]: (e) => new GithubQueryView(e),
    [viewTypes.anyWebsite]:(e) => new AnyWebsiteQueryView(e),
    [viewTypes.news]:(e) => new NewsQueryView(e)
}

export const defaultStylesDesktop = {
    [viewTypes.reddit]: {
        width: 30 + 'rem',
        height: 50 + 'rem'
    },
    [viewTypes.anyWebsite]: {
        width: 30 + 'rem',
        height: 50 + 'rem'
    },
    [viewTypes.github]: {
        width: 30 + 'rem',
        height: 50 + 'rem'
    },
    [viewTypes.news]: {
        width: 45 + 'rem',
        height: 50 + 'rem'
    },
    [viewTypes.default]: {
        width: 30 + 'rem',
        height: 50 + 'rem'
    }
}

const capitalize = words => words.split(' ').map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ')

export const getHeaderText =  {
    [viewTypes.reddit]: (query) => query.subreddit === ''? 'Reddit' : query.subreddit, 
    [viewTypes.github]: (query) => query.repositoryAndOwner === '' ? 'Github' : 'github ' + query.owner + '/' + query.repo,
    [viewTypes.anyWebsite]:(query) => query.website,
    [viewTypes.news]:(query) => query.selectNewsBy === 'sources' ? query.newsQueryObject.sourcesText : capitalize(countries[query.newsQueryObject.country] + ' | ' + query.newsQueryObject.category),
    [viewTypes.default]:(query) => 'Welcome'

}   