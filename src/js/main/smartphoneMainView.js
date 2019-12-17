var $ = require('jquery');
require('webpack-jquery-ui/sortable');
require('webpack-jquery-ui/accordion');


import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import {makeDomIdUnique, makeDOMId} from '../util/helper.js'
import MainView from './mainView.js'




import { desktopContentViewConstructorMap  as contentViewConstructorMap, defaultStylesDesktop as defaultStyles} from './plugins.js' 
const DOM = { $nav: $('#nav')}


export default class SmartphoneMainView extends MainView {

constructor() {
        

        DOM.$nav
            .removeClass('navbar-expand-lg')

        super()

        this.container = document.getElementById('container');
        this.$container = $(this.container)

        this.$container.sortable({axis: "y", handle: ".handle"})
        this.$container.on( "sortupdate", ( event, ui ) => {
            let order = this.$container.sortable( "toArray" );
            events.publish(eventTypes.sortUpdate, order)
        } );

    }


    



    getType() {
        return 'smartphone'
    }
    

    createNewView({query}) {
        let card = this.createCard();
        let $card = $(card)
        this.container.appendChild(card);
        card.setAttribute("id", makeDomIdUnique(makeDOMId(6)));
        const cardBody = $card.find('.card-body')[0]
        this.setHeader($card.find('.card-header'), query)

        this.makeInteractive($card)

        const view = contentViewConstructorMap[query.type](cardBody, card.id)

        events.publish(eventTypes.newView, {element:card, view, query})
    }


    
    createViewsFromCache(cardSet) {
        let keys = Object.keys(cardSet), positions = [], i = 0;
        let nonSmartphoneEntries = []
        positions.length = keys.length
        for(const key of keys) {
            if(cardSet[key].smartphone) positions[cardSet[key].smartphone.position] = key
            else nonSmartphoneEntries.push(key);
        }
        positions = positions.filter(item => item)
        for(i=0; i<positions.length; i++) {
            this.createViewLoop(positions, cardSet, i)
        }
        for(i=0; i<nonSmartphoneEntries.length; i++) {
            this.createViewLoop(nonSmartphoneEntries, cardSet, i)
        }
        this.makeInteractive()
        if(keys.length === 1 && keys[0] === 'default') $('#' + keys[0]).find('.collapse').collapse('show')
    }

    createViewLoop(positions, cardSet, i) {
        let id = positions[i]
        var card = this.createCard();

        this.container.appendChild(card);
        let $card = $(card)

        card.setAttribute("id", id);
        var query = cardSet[id].content
        this.setHeader($card.find('.card-header'), query)

        this.createViewFromCache(card, query); 
    }


    createViewFromCache(element, query) {
        const elementBody = $(element).find('.card-body')[0]
        const view = contentViewConstructorMap[query.type](elementBody, element.id)
        events.publish(eventTypes.newView, {element: element, view, query})
    }


    createCard() {
        let element = document.createElement('div');
        element.setAttribute('class','card');
        const collapseId = makeDOMId(6)
        element.innerHTML = 
        ` 
            <div class="card-header">
                <h2 class="mb-0">
                        
                        <span class="plmn-toggle card-title-plus" data-toggle='collapse' data-target="#${collapseId}"></span>
                        <button style="flex:2 1 70%;" class="card-title btn btn-link" type="button" data-toggle='collapse' data-target="#${collapseId}">
                        </button>
                    <div class="handle" style="flex:1 4 16%;display:inline-block;text-align:center;margin-right:15%;">&#x21D5&#x21D5&#x21D5</div>
                    <div class="close-button-div" style="flex:0.4 8 8%;"><span class="close-button">&times;</span></div>
                </h2>
            </div>
            <div id="${collapseId}" class = 'collapse'>
                <div class="card-body">
                </div>
            </div>
        `;
        return element;
    }


    makeInteractive(elements = $(".card")) {
        elements.on('click', (e) => this.onCloseButtonClicked(e))
    }


    onCloseButtonClicked(e) {
        if(e.target.classList.contains('close-button-div') || e.target.classList.contains('close-button')) {
            events.publish(eventTypes.viewClosed + e.currentTarget.id, {id:e.currentTarget.id})
            events.remove(eventTypes.viewClosed + e.currentTarget.id)
            events.remove(eventTypes.loadMore + e.currentTarget.id)
            this.removeElement(e.currentTarget)
        }
    }

    wrapUpView() {}

    removeElement(card) {
        $(card).fadeOut();
        setTimeout(function(){card.parentNode.removeChild(card);}, 400);
    }
}


$('#container').on('hidden.bs.collapse show.bs.collapse', function (e) {
    $(e.target)
        .parent()
        .find('.card-header')
        .find('.plmn-toggle')
        .toggleClass('card-title-plus')
        .toggleClass('card-title-minus');
});
