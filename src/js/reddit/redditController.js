var $ = require('jquery');



import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import RedditModel from './redditModel.js'
import RedditDataFormatter from './redditDataFormatter.js'
import ViewController from '../main/viewController.js'


export default class RedditController extends ViewController {

constructor() {
    super()
    this.model = new RedditModel();
    this.dataFormatter = new RedditDataFormatter();
}



async showContent(view, query) {
    view.showSpinner()
    try {var res = await this.model.getContent(query)}
    catch(e) {view.showMessage(e.message); view.unShowSpinner(); return;}
    view.unShowSpinner()
    view.showContent(this.dataFormatter.formatData(res))
    this.handleConditionalForAfter(view, query, res.data.after);
}

async showMoreContent(view) {
    view.removeLoadMoreLink() 
    view.showSpinner()
	let query = this.idToQueryMap.get(view.id);
    try {var res = await this.model.getMoreContent(query)}
    catch(e) {view.showMessage(e.message); view.unShowSpinner(); return;}
    view.unShowSpinner()
    view.showMoreContent(this.dataFormatter.formatData(res))
    this.handleConditionalForAfter(view, query, res.data.after);
}


validate(e) {
    e.view.unShowInputAsInvalid()
    if(!/^[\s\S]{0}$|^\/?r\/[a-zA-Z0-9]*\/?$|(https:\/\/)?www\.reddit\.com\/r\/[a-zA-Z0-9]*\/?$/.test(e.query.subreddit))
        e.view.showInputAsInvalid('wrong subreddit input')
    else if(!/^[0-9]+$/.test(e.query.limit)) 
        e.view.showInputAsInvalid('wrong counter input')
    else events.publish(eventTypes.newViewRequired, e);
}


handleConditionalForAfter(view, query, after) {
    if (after != null) {
        view.addLoadMoreOption();
        let queryCopy = $.extend(true, {}, query)
        queryCopy.after = after;
        this.idToQueryMap.set(view.id, queryCopy);
    }
    else
        this.idToQueryMap.delete(view.id);
    events.publish(eventTypes.finishedLoading, view);
}



}