
var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import QueryView from '../main/queryView.js'


export default class AnyWebsiteQueryView extends QueryView {

constructor(domElementForValidationRequired) {
    super(domElementForValidationRequired)
}

onValidationRequired(){
    if(document.querySelector(".tab-pane.active").id === "website") {
        events.publish(eventTypes.validationRequired, {query: {type: "anyWebsite", website:document.getElementById("website_url").value}, view:this})
    }
}

}

