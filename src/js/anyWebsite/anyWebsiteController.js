
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'

export default class AnyWebsiteController {

constructor() {

}


async showContent(view, query) {
    if(query.website === "") query.website = 'no_website';
    view.showContent(query.website)
}

attachView() {
    return
}


validate(e) {
    events.publish(eventTypes.newViewRequired, e);
}


}