
var $ = require('jquery');
const DOM = {$redditEntries:$("#redditEntries"), subreddit: document.getElementById("subreddit"),
$redditWrongInput: $('#redditWrongInput'),  redditWrongCounterInput:$('#redditWrongCounterInput')}

import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import QueryView from '../main/queryView.js'
require("bootstrap-input-spinner");

export default class RedditQueryView extends QueryView {

constructor(domElementForValidationRequired) {
    super(domElementForValidationRequired)
    DOM.$redditEntries.inputSpinner();

}



showInputAsInvalid(validationResult) {
    switch(validationResult) {
        case 'wrong subreddit input':
            DOM.redditWrongCounterInput.removeClass('d-block').addClass('d-none');
            DOM.$redditWrongInput.removeClass('d-none').addClass('d-block');
            break;
        case 'wrong counter input':
            DOM.$redditWrongInput.removeClass('d-block').addClass('d-none');
            DOM.redditWrongCounterInput.removeClass('d-none').addClass('d-block');
            break;
    }
}

unShowInputAsInvalid() {
    DOM.$redditWrongInput.removeClass('d-block').addClass('d-none');
    DOM.redditWrongCounterInput.removeClass('d-block').addClass('d-none');        
}


onValidationRequired(){
    if(document.querySelector(".tab-pane.active").id === "reddit") {
        events.publish(eventTypes.validationRequired, {query: this.createQuery(), view:this})
    }
}

createQuery() {
    let query = {}
    query.subreddit = DOM.subreddit.value;
    query.limit= DOM.$redditEntries.val();
    query.type = 'reddit'
    return query;
}

}

