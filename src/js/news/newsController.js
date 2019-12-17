
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import NewsModel from './newsModel.js'
import NewsDataFormatter from './newsDataFormatter.js'
import ViewController from '../main/viewController.js'

export default class NewsController extends ViewController {

constructor() {
    super();
    this.model = new NewsModel();
    this.dataFormatter = new NewsDataFormatter();

    events.subscribe(eventTypes.countriesRequired, (e) => this.insertCountries(e.view))
    events.subscribe(eventTypes.sourcesRequired, (e) => this.insertSources(e.view, e.query))
}


async insertSources(view, query) {
    view.unShowThatThereAreNoSources()
    try{var res = await this.model.getSources(query)}catch(e){console.log(e.message)}
    await view.insertSources(res.sources)
    if(res.sources.length === 0) view.showThatThereAreNoSources()
}

async insertCountries(view){
    view.insertCountries(await this.model.getCountries())
}

async showContent(view, query) {
    view.showSpinner()
    try {var res = await this.model.getContent(query)}
    catch(e) {view.showMessage(e.message); view.unShowSpinner(); return;}
    if(res.articles.length == null) view.showMessage("There are no news for your selection")
    view.unShowSpinner()
    view.showContent(this.dataFormatter.formatData(res))
    this.handleConditionalForLoadMore(res, view, query)
}

async showMoreContent(view) {
    view.removeLoadMoreLink()
    view.showSpinner() 
    let query = this.idToQueryMap.get(view.id);

    try {var res = await this.model.getMoreContent(query)}
    catch(e) {view.showMessage(e.message); view.unShowSpinner(); return;}
    view.unShowSpinner()
    view.showMoreContent(this.dataFormatter.formatData(res))
    this.handleConditionalForLoadMore(res, view, query)
}

handleConditionalForLoadMore(res, view, query) {
    if(res.totalResults > res.articles.length + (query.page - 1 || 0)*query.newsQueryObject.pageSize) {
        view.addLoadMoreOption();
        let queryCopy = $.extend(true, {}, query)
        queryCopy.page = query.page || 1;
        queryCopy.page++;
        this.idToQueryMap.set(view.id, queryCopy); 
    } 
    else this.idToQueryMap.delete(view.id);
    events.publish(eventTypes.finishedLoading, view);

}


validate(e) {
    e.view.unShowInputAsInvalid()
    let hasCorrectInput = true
    if(e.query.selectNewsBy === 'country and/or category' && (e.query.newsQueryObject.country == "" && e.query.newsQueryObject.category == "")) {
        e.view.showInputAsInvalid('no country and category')  
    }
    else if(e.query.selectNewsBy === 'sources' && e.query.newsQueryObject.sources==="") {
        e.view.showInputAsInvalid('no sources')
    }
    else if(!/^[0-9]+$/.test(e.query.newsQueryObject.pageSize) && hasCorrectInput) {
        e.view.showInputAsInvalid('wrong counter input')
    }
    else events.publish(eventTypes.newViewRequired, e);
}


}