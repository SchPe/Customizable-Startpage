var $ = require('jquery');


import {queryViewConstructorMap, viewTypes, getHeaderText} from './plugins.js' 


const DOM = {$nav: $('#nav'), validationRequiredButton: document.getElementById('Ok'), $modal: $("#exampleModal")}

let queryViewMap = new Map();

export default class MainView {
    
    constructor() {
        DOM.$nav
            .removeClass('navbar-expand-lg')
            .addClass('navbar-expand-xl')

        DOM.$nav.css('display', 'flex')    

        Object.entries(queryViewConstructorMap).map(([key, value]) => queryViewMap.set(key, value(DOM.validationRequiredButton)))
        
    }

    setHeader($header, query) {
        $header.find('.card-title').prepend(getHeaderText[query.type](query))
    }

    hideQueryView() {
        DOM.$modal.modal('hide');
    }

    init() {
        queryViewMap.get(viewTypes.news).init()
    }


    onNewViewRequired() {
        throw new Error('This is an abstract method, you have to implement it in a derived class!');
    }

    createViewsFromData(data) {
        throw new Error('This is an abstract method, you have to implement it in a derived class!');
    }

    getDomElementForValidationRequired() {
        return this.domElementForNewView
    }
    getDomElementForNewView() {
        return this.domElementForValidationRequired
    }
    
}
