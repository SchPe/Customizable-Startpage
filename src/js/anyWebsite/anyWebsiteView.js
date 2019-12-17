var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import {makeDomIdUnique, makeId} from '../util/helper.js'
import View from '../main/view.js'

var iframeId;


export default class AnyWebsiteView extends View  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)
        if(document.querySelector('.desktop')) this.mainDomElement.style.overflow = 'hidden';
    }

    showContent (website) {
        $(this.mainDomElement).addClass("iframeBody");
        iframeId = makeDomIdUnique(makeId(5))
        var regex = /^(http:\/\/|https:\/\/)/;
        if(document.querySelector('.smartphone')) this.mainDomElement.innerHTML =  `<iframe   id='${iframeId}' src="${regex.test(website) ? website : 'http://' + website}"></iframe>`;
        else this.mainDomElement.innerHTML =  `<iframe id='${iframeId}' src="${regex.test(website) ? website : 'http://' + website}"></iframe>`;
    }
}






