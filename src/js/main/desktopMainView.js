var $ = require('jquery');
require('webpack-jquery-ui/draggable');


import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import {makeDomIdUnique, makeDOMId, detectIE} from '../util/helper.js'
import MainView from './mainView.js'


// extends MainView
import { desktopContentViewConstructorMap  as contentViewConstructorMap, defaultStylesDesktop as defaultStyles} from './plugins.js' 
const DOM = {$body: $('body'), validationRequiredButton: document.getElementById('Ok'), $modal: $("#exampleModal"), $nav: $('#nav'), $navToggler: $('#nav').find('.navbar-toggler'), $navNav: $('#nav').find('.navbar-nav')
}


export default class DesktopMainView extends MainView {

    constructor() {
        super()
        if(detectIE()) DOM.$body.addClass('ie11');

        this.isDragging = false;
        this.wasDragging = false;
        this.max_z_index = 0;
        this.resizeTimer = true;

        DOM.$nav
            .on('hidden.bs.collapse show.bs.collapse', (e) => {
                if(e.type === "show")
                    $(e.currentTarget).addClass('zIndexMax')
                else 
                    $(e.currentTarget).removeClass('zIndexMax')
            });
}


    wrapUpView(view) {
        this.activateTooltips(view);
    }


    activateTooltips(view) {
        $(view.mainDomElement).find('[data-toggle="tooltip"]')
            .not('.activatedTooltip')
            .tooltip({trigger: 'manual', placement: "auto", boundary:"viewport", container:"body"})
            .addClass('activatedTooltip')
            .mouseenter(e => onMouseenter(e) );
    }


    getType() {
        return 'desktop'
    }
    

    createNewView({query}) {
        let card = this.createCard();
        card.setAttribute("id", makeDomIdUnique(makeDOMId(6)));
        const cardBody = $(card).find('.card-body')[0]
        this.setHeader($(card).find('.card-header'), query)
        this.positionNewCard(card)
        const view = contentViewConstructorMap[query.type](cardBody, card.id)
        this.setDefaultStyle(card, query.type)
        events.publish(eventTypes.newView, {element:card, view, query})
    }


    
    
    createViewsFromCache(cardSet) {
        var id;
        for(id in cardSet) {
            if(cardSet[id].desktop) {
                this.createDesktopViewFromCache(cardSet, id)
            }
        }
        for(id in cardSet) {
            if(!cardSet[id].desktop) {
                this.createNonDesktopViewFromCache(cardSet, id)
            }
        }
    }

    createDesktopViewFromCache(cardSet, id) {
        var card = this.createCard();
        var query = cardSet[id].content
        card.setAttribute("id", id);
        this.setHeader($(card).find('.card-header'), query)
        this.positionCardFromCache(card, cardSet, id)
        this.createViewFromCache(card, query);  
    }

    createNonDesktopViewFromCache(cardSet, id) {
        var card = this.createCard();
        var query = cardSet[id].content
        card.setAttribute("id", id);
        this.setHeader($(card).find('.card-header'), query)
        this.positionNewCard(card, cardSet, id)
        this.setDefaultStyle(card, query.type)
        this.createViewFromCache(card, query);  
    }


    positionCardFromCache(card, cardSet, id) {
        var $card = $(card);
        document.body.appendChild(card); 
        // card.style.left = cardSet[id]['desktop'].position.left +'px';
        // card.style.top = cardSet[id]['desktop'].position.top + 'px';
        $card.offset({left: cardSet[id]['desktop'].position.left, top: cardSet[id]['desktop'].position.top})
        this.mandatoryStyling(card)
        $card.height(cardSet[id]['desktop'].dimension.height);
        $card.width(cardSet[id]['desktop'].dimension.width);
        $card.css("z-index", `${cardSet[id]['desktop'].zIndex}`)
        this.makeInteractive($card)
        if(parseInt(cardSet[id]['desktop'].zIndex) > this.max_z_index) this.max_z_index = parseInt(cardSet[id]['desktop'].zIndex);
        

    }

    mandatoryStyling(element) {
        element.childNodes.item(0).style.top = 0 + 'rem';
    }


    createCard() {
        let element = document.createElement('div');
        element.setAttribute('class','card');
        element.innerHTML = 
        `<div class="card-header">
        <span class="card-title" style="flex:9 1 95%;"></span>
        <div style="flex:1 9 5%;"></div>
        <span class="close-button">&times;</span>
        </div>
        <div class="card-body">
            <h5 class="card-title"></h5>
            <p class="card-text"></p>
        </div>
        <div class="card-footer text-muted">
        </div>`;
        return element;
    }

    positionNewCard(element) {
        var cards = document.querySelectorAll(".card");
        cards = Array.from(cards);
        var cardPositions = cards.map(card => card.getBoundingClientRect());
        document.body.appendChild(element);
        var coordinates = this.findSpace(cardPositions, 400, 400);
        element.style.left = (coordinates[0] + 10) + 'px';
        element.style.top = (coordinates[1] + 84 + 25) + 'px';
        // element.style.top = (coordinates[1] + DOM.$nav.height() + 25) + 'px';

        var $element = $(element);
        $element.css("z-index", "0");
        this.makeInteractive($element);
        this.mandatoryStyling(element)
        return element;
    }

    createViewFromCache(element, query) {
        const elementBody = $(element).find('.card-body')[0]
        const view = contentViewConstructorMap[query.type](elementBody, element.id)
        events.publish(eventTypes.newView, {element: element, view, query})
    }


    makeInteractive(elements = $(".card")) {
        if (typeof elements.resizable === "function") { 
            elements.resizable();
        }
        elements.draggable({ cursor: "move", handle: ".card-header, .card-footer", snap: true});   
        this.publishOnResize(elements)
        elements.on('mouseup', (e) => this.onCloseButtonClicked(e))
    }


    onCloseButtonClicked(e) {
        if(e.target.classList.contains('close-button')) {
            events.publish(eventTypes.viewClosed + e.currentTarget.id, {id:e.currentTarget.id})
            events.remove(eventTypes.viewClosed + e.currentTarget.id)
            events.remove(eventTypes.loadMore + e.currentTarget.id)
            events.remove(eventTypes.drag + e.currentTarget.id)
            events.remove(eventTypes.resize + e.currentTarget.id)
            events.remove(eventTypes.changedZIndex + e.currentTarget.id)
            this.removeElement(e.currentTarget)
        }
    }

    removeElement(card) {
        $(card).fadeOut();
        setTimeout(() => {card.parentNode.removeChild(card);}, 400);
    }

    setDefaultStyle(card, viewType) {
        card.style.width = defaultStyles[viewType].width;
        card.style.height = defaultStyles[viewType].height;
    }

    publishOnResize(elements) {
        elements
        .mousedown(() => {
            this.isDragging = true;
        })
        .mousemove((e) => {
            if(this.isDragging) {
                if($(e.target).attr("class") !== 'close-button') {
                    $(e.currentTarget).css("z-index", `${++this.max_z_index}`);
                    events.publish(eventTypes.changedZIndex + e.currentTarget.id, {element:e.currentTarget})
                }
                this.wasDragging = true;
                this.isDragging = false;
            }
        })
        .mouseup((e) => {
            this.isDragging = false;
            if (this.wasDragging) {
                if($(e.target).attr("class") !== 'close-button') {
                    events.publish(eventTypes.resize + e.currentTarget.id, {element:e.currentTarget})
                    events.publish(eventTypes.drag + e.currentTarget.id, {element:e.currentTarget})
                }
                this.wasDragging = false
            }
            
        });
    }


    findSpace(cardPositions, width, height) {
        var foundSpace = false;
        var sequence = WritingGenerator();
        var result;
        var position; 
        
        while(!foundSpace) {
            result = sequence.next();
            position = {left: 100*result.value[0], right: 100*result.value[0] + width, top: 100*result.value[1], bottom: 100*result.value[1] + height};
            foundSpace = true;
            cardPositions.forEach(cardPosition => {
                if(!(cardPosition.right < position.left || 
                cardPosition.left > position.right || 
                cardPosition.bottom < position.top || 
                cardPosition.top > position.bottom)) {
                    foundSpace = false;
                }
            });
        }
        return [position.left, position.top];
    }
}



function* WritingGenerator() {        
    var x = 0;
    var y = 0;
    while(x<=4) {
        yield [x, y];
        x++;
    }
    while(y<3) {
        x=0;
        y++;
        while(x<=4) {
            yield [x, y];
            x++;
        }
    }
    x--;
    while(true) {
        x++;
        y=0;
        while(y<x-2) {
            yield [x, y];

            y++;
        }
        x=0;
        while(x<y+2) {
            yield [x, y];
            x++;
        }
    }
}





let hoverTimer = {};
let mousemoveTimer = {};
let element;
function onMouseenter(e) {
    if(element != null) resetTooltip(element)
    element = e.currentTarget
    hoverTimer = setTimeout(() => {
        $(element).tooltip('show')
        document.addEventListener('mousemove', onMousemove)
    }, 500);
}

let bounce = true;
let wasMoving = false;
function onMousemove() {
    if(bounce) {
        bounce = false
        mousemoveTimer = setTimeout(() => {bounce = true}, 100)
        if(wasMoving) {
            resetTooltip(element)
        }
        else wasMoving = true;
    }
}   
function resetTooltip(element) {
    document.removeEventListener('mousemove', onMousemove);
    clearTimeout(hoverTimer)
    clearTimeout(mousemoveTimer)
    $(element).tooltip('hide')
        .off('mousemove')
    element = null
    bounce = true;                         
    wasMoving = false;
}
