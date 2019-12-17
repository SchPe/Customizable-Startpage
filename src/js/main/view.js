
var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'


export default class View {
    constructor(mainDomElement, id) {
        this.mainDomElement = mainDomElement;
        this.id = id
    }

    getMainDomElement(){
        return this.mainDomElement
    }

    showMessage(message) {
        this.mainDomElement.innerHTML = `<h4><p class="text-center m-2" style="word-wrap:normal;">${message}</p></h4>`;
    }


    showContent (content) {
        throw new Error('This is an abstract method, you have to implement it in a derived class!');
    }

}

