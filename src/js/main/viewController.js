import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'


export default class ViewController {

    constructor() {
        this.idToQueryMap = new Map();
    }
    
    attachView(view) {
        events.subscribe(eventTypes.loadMore + view.id, (e) => this.showMoreContent(e.view))
        events.subscribe(eventTypes.viewClosed + view.id, (e) => this.onViewClosed(e))
    }



    onViewClosed(e) {
        delete this.idToQueryMap[e.id]
    }


}
