var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import AdvancedView from '../main/advancedView.js'

    
export default class GithubView extends AdvancedView  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)      
    }

    
    showContent (content, fromSingleRepo) {
        this.showMarkAllAsRead()
        this.displayContent(content, fromSingleRepo)    
    }
    showMoreContent(content, fromSingleRepo) {
        this.displayContent(content, fromSingleRepo)
    }

    
    showGithubAuth() {
        this.mainDomElement.innerHTML = `<h6><p class="mt-2 text-center">Please authorize Webpage to receive notifications from Github</p></h6>
                                            <p class="text-center"><button type="button" class="githubAuth btn-secondary">Github Authorization</button> </p>`;
        $('.githubAuth').on('click', () => events.publish(eventTypes.githubAuthRequired))
    }

    
    activateMarkAsRead() {
        let $markAsRead = $(this.mainDomElement).find('.markAsReadAnchor').not('.activatedMark')
        $markAsRead
            .on('click', (e) => this.onMarkAsRead(e))
            .addClass('activatedMark')      
    }

    activateMarkAllAsRed() {
        $('.markAllAsRead').on('click', () => this.onMarkAllAsRead()) 
    }

    onMarkAsRead(e) {
        var threadID = e.currentTarget.getAttribute("thread_id")
        events.publish(eventTypes.markAsRead, {viewID:this.id, threadID:threadID, view:this})
        var $thread = $(this.mainDomElement).find(`#${threadID}`) 
        var $sibling = $thread.next() 
        $thread.remove();  
        if($sibling.length > 0) $sibling.remove();
    }
    
   showMarkAllAsRead(){
            this.mainDomElement.innerHTML +=`<p class="markAllAsRead text-center m-2"><a href="javascript:void(0)">
            <?xml version="1.0" encoding="utf-8"?>
            <svg style="margin-right:0em;" width="1.3em" height="1.3em" viewBox="0 200 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z" fill="green"/></svg>
            <span class="markAsReadText">Mark all as read</span></a></p> <hr/>`;
            
   }

   onMarkAllAsRead() {
    events.publish(eventTypes.markAllAsRead, {id: this.id, view: this})
    this.showMessage('No new notifications');
   }
 

displayContent(content, fromSingleRepo) {
    let i, htmlArray = [];
    for(i = 0; i<content.length; i++) {
        htmlArray.push(createNotificationEntry(content[i], fromSingleRepo));
    }
    this.mainDomElement.innerHTML += htmlArray.map((entry) => entry).join('<hr/>');
}
  
}


function createNotificationEntry({title, id, bodyHTML, url, hasBody, repo, type }, fromSingleRepo) {
    return `
        <div class="github-container" id="${id}">
            <div class="githubInfo ${hasBody ? "no-body" : ""}" ` + (hasBody ? `style="grid-column-start:1; grid-column-end:3;"` : "") + ` data-toggle="tooltip" class="tooltipText" title="${title}"` + `>
                <a href="${url}" target="_blank">
                <div class ="github-badges">
                    <div class="badge-container" style="float:left;"><span class="badge badge-secondary">${type}</span></div>
                    ` 
            +
                (fromSingleRepo ? "" : `<div class="badge-container" style="float:left;"><span class="badge badge-info repo-badge">${repo}</span></div>`)
            +
                `</div>
                    ${title}
                </a>     
                <div class="mark-as-read"><a class="markAsReadAnchor" href="javascript:void(0)" thread_id="${id}">
                <span class="icon-checkmark"></span>
                <span class="markAsReadText">Mark as read</span></a></div>
            </div>`
            + (hasBody ? 
                "" :
                `<div class="githubBody" data-toggle="tooltip" data-html="true" class="tooltipText" title='${bodyHTML}'>
                    <p>${bodyHTML}</p>
                </div>`
            )
            +
        `</div>
    `;
}
