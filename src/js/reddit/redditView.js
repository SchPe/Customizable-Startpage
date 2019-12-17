var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import AdvancedView from '../main/advancedView.js'

export default class RedditView extends AdvancedView  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)    
    }


    showContent (content) {
        this.mainDomElement.innerHTML = content.map((entry) => this.createRedditEntry(entry)).join('<hr/>');
    }
    showMoreContent (content) {
        this.mainDomElement.innerHTML += content.map((entry) => this.createRedditEntry(entry)).join('<hr/>');
    }


    createRedditEntry({hasImage, url, score, title, permalink, selftext_html}) {
        return decodeHtml(`
        <div class="reddit-container">
        <div class="badge-container"><b><span class="badge badge-secondary">${kFormatter(score)}</span></b></div>
        <div class="media">
            <a class="img-link redditImg ${hasImage ? "" : "no-image"}" href="${url}" target="_blank">
                ${hasImage ? `<img src="${url}" onerror="this.onerror=null;this.src='/images/placeholder.png';" data-toggle="tooltip" data-html="true" class="tooltipText" ${window.isMobile ? '' : `title='<a href="${url}" target="_blank"><img src="${url}"></a>'` } data-template='<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner toolImg"></div></div>'>` 
                : 
                ""}  
            </a> 
            <div class="media-body ${hasImage ? "" : "no-image"}"> 
                <div> 
                    <a href="${'https://www.reddit.com' + permalink}" data-toggle="tooltip"  title="${title}" >
                        <h4>${title}</h4> 
                    </a>`
                    +
                    (/reddit/.test(url) ? 
                    "" : 
                        (hasImage ?
                        "" : 
                        `<a class="isolated" href="${url}" target="_blank"><p>${url}</p></a>`)
                    )
                    +
                    `<div class="reddit-body" ${selftext_html == null ? "" : `data-toggle="tooltip" data-html="true" class="tooltipText" title='${selftext_html}'`}>
                        ${selftext_html == null ? "" : selftext_html}
                    </div> 
                </div>
            </div>
        </div>
        </div>
        `);
    }

    
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

