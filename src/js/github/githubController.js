
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import GithubModel from './githubModel.js'
import GithubModelWithCacheDecorator from './githubModelWithCacheDecorator.js'
import GithubDataFormatter from './githubDataFormatter.js'
import ViewController from '../main/viewController.js'


export default class GithubController extends ViewController {

constructor() {
    super()
    this.model = new GithubModelWithCacheDecorator(new GithubModel(), new GithubDataFormatter());
    events.subscribe(eventTypes.githubAuthRequired, () => this.githubAuth())
    events.subscribe(eventTypes.markAllAsRead, (id) => this.markAllAsRead(id))
    events.subscribe(eventTypes.markAsRead, (e) => this.markAsRead(e))
}


async markAsRead(e) {
    let query = this.idToQueryMap.get(e.viewID);
    query.threadID = e.threadID;
    try{await this.model.markAsRead(query)} catch(error) {e.view.showMessage(e.message)}
}

async markAllAsRead({id, view}) {
    let query = this.idToQueryMap.get(id);
    try{await this.model.markAllAsRead(query)} catch(e) {view.showMessage(e.message)}
}

githubAuth() {
    this.model.githubAuth()
}



async showContent(view, query) {
    view.showSpinner()
    try {var res = await this.model.getContent(query)}
    catch(e) {
        if(e.message === '401') view.showGithubAuth();
        else view.showMessage(e.message); 
        view.unShowSpinner()
        return
    }
    view.unShowSpinner()
    let fromSingleRepo = query.repo !== ""
    view.showContent(res.content, fromSingleRepo)
    this.handleConditionalForLoadMore(res, view, query);
}

async showMoreContent(view) {
    view.removeLoadMoreLink() 
    view.showSpinner()
    let query = this.idToQueryMap.get(view.id);
    try {var res = await this.model.getMoreContent(query)}
    catch(e) {view.showMessage(e.message); view.unShowSpinner(); return;}
    view.unShowSpinner()
    let fromSingleRepo = query.repo !== ""
    view.showMoreContent(res.content, fromSingleRepo)
    this.handleConditionalForLoadMore(res, view, query);
}


validateA(e) {
    if(/^https:\/\/github\.com\/([^\/]*)\/([^\/]*)\/?$|^[\s\S]{0}$/.test(e.query.repositoryAndOwner)) {
        e.view.unShowInputAsInvalid() 
        if(e.query.repositoryAndOwner === "") {
            e.query.owner = "";
            e.query.repo = "";
        }
        else {
            var myRegexp = /https:\/\/[^\/]*\/([^\/]*)\/([^\/]*)\/?/;
            var match = myRegexp.exec(e.query.repositoryAndOwner);
            e.query.owner = match[1];
            e.query.repo = match[2];
        }  
        events.publish(eventTypes.newViewRequired, e);    
    }
    else e.view.showInputAsInvalid()
}
validate(e) {
    e.view.unShowInputAsInvalid() 
    if(/^[\s\S]{0}$|^\s*$/.test(e.query.repositoryAndOwner)) {
        e.query.owner = "";
        e.query.repo = "";
        events.publish(eventTypes.newViewRequired, e);  
    }
    else if(/^https:\/\/github\.com\/([^\/]*)\/([^\/]*)\/?$/.test(e.query.repositoryAndOwner)) {
        var myRegexp = /https:\/\/[^\/]*\/([^\/]*)\/([^\/]*)\/?/;
        var match = myRegexp.exec(e.query.repositoryAndOwner);
        e.query.owner = match[1];
        e.query.repo = match[2];
        events.publish(eventTypes.newViewRequired, e);  
    }  
    else e.view.showInputAsInvalid()
}


handleConditionalForLoadMore(res, view, {owner, repo}) {
    const link = res.link
    if (link != null) {
        view.addLoadMoreOption();
        this.idToQueryMap.set(view.id, {link, owner, repo});
    }
    else  this.idToQueryMap.delete(view.id);  
    events.publish(eventTypes.finishedLoading, view);
    view.activateMarkAllAsRed()
    view.activateMarkAsRead()

}

}