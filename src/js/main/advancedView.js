import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import View from './view.js'




export default class AdvancedView extends View  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)
        
    }


    addEventListeners() {
        $(this.mainDomElement).find('.loadMore').on('click', () => this.onLoadMore())
    }



    onLoadMore() {
        events.publish(eventTypes.loadMore + this.id, {view:this})
    }



    addLoadMoreOption(){
        this.mainDomElement.innerHTML += `<hr/><p class="loadMore text-center m-2"><button class="btn btn-outline-secondary" >Load more</button></p>`
        this.addEventListeners()
    }

    removeLoadMoreLink() {
        $(this.mainDomElement).find('.loadMore').remove();
    }


    showMoreContent (content) {
        throw new Error('This is an abstract method, you have to implement it in a derived class!');
    }


    showSpinner() {
        this.mainDomElement.innerHTML += `<div class="spinner" style="position:relative;height:2rem;"><div style="position:absolute;left:50%;transform:translate(-50%);width:min-content;"><div class="spinner-border text-primary"  role="status">
                                        <span class="sr-only">Loading...</span>
                                        </div></div></div>`;
        

    }

    unShowSpinner() {
        $(this.mainDomElement).find('.spinner').remove();    
    }

}





