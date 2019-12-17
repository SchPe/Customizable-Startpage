import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'


const cardsLocalStorageKey = "cards"

var positions = []

export default class CacheController {

    constructor(device) {
        events.subscribe(eventTypes.newView, (e) => this.cacheNewView(e))
        events.subscribe(eventTypes.sortUpdate, (order) => this.onSortUpdate(order))
        this.device = device
        this.cardSet = JSON.parse(window.localStorage.getItem(cardsLocalStorageKey)) || {cards: {}};
        if(Object.keys(this.cardSet.cards).length === 0 && this.cardSet.cards.constructor === Object) {
            this.cardSet.cards.default = {content: {type: 'default'}}
        }
        if(device === 'smartphone') {
            this.initializePositions();
        }    
    }

    updateCache() {
        const dataElement = document.getElementById('data')
        if(dataElement) {
            const onlineCardSet = JSON.parse(dataElement.textContent);
            const idToken = document.getElementById('idToken').textContent;
            onlineCardSet.timeStamp = onlineCardSet.timeStamp || 0
            this.cardSet.timeStamp = this.cardSet.timeStamp || 0

            if(onlineCardSet.cards && idToken !== this.cardSet.idToken || idToken === this.cardSet.idToken && onlineCardSet.timeStamp > this.cardSet.timeStamp) {
                this.cardSet = onlineCardSet;
                this.cardSet.idToken = idToken;
                this.cardSet.cards = this.cardSet.cards || {}
                window.localStorage.setItem('cardSet_updated', 'false');
            }
            else window.localStorage.setItem('cardSet_updated', 'true');
        }
        else {
            this.cardSet.idToken = 0;
        }
        if(this.device === 'smartphone') this.initializePositions();
    }




    onSortUpdate(order) {
        positions = order
        this.reIndex();
        this.cacheCardSet()
    }

    reIndex() {
        let i;
        for(i = 0; i<positions.length; i++) {
            this.cardSet.cards[positions[i]].smartphone.position = i
        }
    } 

    getCacheData() {
        return this.cardSet
    }
    
    cacheCardSet() {
        this.cardSet.timeStamp = Date.now();
        window.localStorage.setItem(cardsLocalStorageKey, JSON.stringify(this.cardSet));
        window.localStorage.setItem('cardSet_updated', 'true');
    }

    cacheNewView(e) {
        this.attachView(e.view)

        if(e.element.id in this.cardSet.cards) {
            if(this.cardSet.cards[this.device]) return;
        }
        else this.cardSet.cards[e.element.id] = {};
        
        var element = e.element;

        if(this.device === 'desktop') this.cacheNewDesktopView(element);
        else if(this.device === 'smartphone') this.cacheNewSmartphoneView(element);

        this.cardSet.cards[element.id]["content"] = e.query
        this.cacheCardSet()
    }

    cacheNewDesktopView(element) {
        var $element = $(element)

        
        this.cardSet.cards[element.id][this.device] = {}
        this.cardSet.cards[element.id][this.device]["position"] = {left:$element.offset().left, top:$element.offset().top};
        this.cardSet.cards[element.id][this.device]["zIndex"] = "0";
        this.cardSet.cards[element.id][this.device]["dimension"] = {height:$element.height(), width:$element.width()}
    }

    cacheNewSmartphoneView(element) {
        this.cardSet.cards[element.id][this.device] = {}
        this.cardSet.cards[element.id][this.device]['position'] = $(element).index()

        positions.push(element.id);
    }

    attachView(view) {
        events.subscribe(eventTypes.resize + view.id, (e) => this.onResize(e))
        events.subscribe(eventTypes.drag + view.id, (e) => this.onDrag(e))
        events.subscribe(eventTypes.changedZIndex + view.id, (e) => this.onChangedZIndex(e))
        events.subscribe(eventTypes.viewClosed + view.id, (e) => this.onViewClosed(e))
    }

    onViewClosed(e) {
        delete this.cardSet.cards[e.id]
        if(this.device === 'smartphone') {
            positions.splice(positions.indexOf(e.id), 1)
            this.reIndex();
        } 
        this.cacheCardSet()
    }

    onResize(e) {
        let $element = $(e.element);
        this.cardSet.cards[e.element.id][this.device].dimension = {width: $element.width(), height: $element.height()};
        this.cacheCardSet()
    }

    onChangedZIndex(e) {
        let $element = $(e.element);
        this.cardSet.cards[e.element.id][this.device].zIndex = $element.css('z-index');
        this.cacheCardSet()
    }
    
    onDrag(e) {
        let $element = $(e.element)
        this.cardSet.cards[e.element.id][this.device].position = {left: $element.offset().left, top: $element.offset().top};
        this.cacheCardSet()
    }

    initializePositions() {
        let keys = Object.keys(this.cardSet.cards)
        positions.length = keys.length
        for(const key of keys) {
            if(this.cardSet.cards[key].smartphone) positions[this.cardSet.cards[key].smartphone.position] = key
        }
        positions = positions.filter(item => item)
    }

}


