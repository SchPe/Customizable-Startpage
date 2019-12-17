
var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import QueryView from '../main/queryView.js'


const DOM = {$githubWrongInput: $('#githubWrongInput'), repositoryAndOwner: document.getElementById("repository")}

export default class GithubQueryView extends QueryView {

constructor(domElementForValidationRequired) {
    super(domElementForValidationRequired)
    
}


showInputAsInvalid() {
    DOM.$githubWrongInput.removeClass('d-none').addClass('d-block');
}

unShowInputAsInvalid() {
    DOM.$githubWrongInput.removeClass('d-block').addClass('d-none');      
}


onValidationRequired(){
    if(document.querySelector(".tab-pane.active").id === "github") {
        events.publish(eventTypes.validationRequired, {query: this.createQuery(), view:this})
    }
}

createQuery() {
    let query = {}
    query.type = 'github'
    let repositoryAndOwner = DOM.repositoryAndOwner.value;
    query.repositoryAndOwner = repositoryAndOwner;
    return query;
}

}

