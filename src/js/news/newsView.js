var $ = require('jquery');
import AdvancedView from '../main/advancedView.js'
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'

  
export default class NewsView extends AdvancedView  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)
        
    }

    
    showContent (content) {
        this.mainDomElement.innerHTML = content.articles.map((entry) => this.createArticle(entry)).join('<hr/>'); 
    }
    showMoreContent (content) {
        this.mainDomElement.innerHTML += content.articles.map((entry) => this.createArticle(entry)).join('<hr/>'); 
    }


createArticle({url, title, description, urlToImage}) {
    let hasImage = /(png|jpg|jpeg|svg|gif)$/.test(urlToImage)
    return `
    <div class="media news">
        <a  href="${url}" target="_blank" class="img-link newsImg${/(png|jpg|jpeg|svg|gif)$/.test(urlToImage) ? "" : "no-image" }">
            ${hasImage ? 
                `<img class='news-img' src='${urlToImage}' onerror="this.onerror=null;this.src='/images/placeholder.png';" data-toggle="tooltip" data-html="true" class="tooltipText" ${window.isMobile ? '' : `title='<a href="${url}" target="_blank"><img src="${urlToImage}"></a>'`} data-template='<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner toolImg"></div></div>'>` 
                : ""}  
        </a> 
        <div class="media-body news ${hasImage ? "" : "no-image" }">
            <div> 
                <a href="${url}" data-toggle="tooltip" class="tooltipText" title="${title}">
                    <h4>${title}</h4> 
                </a>
                <div ${description == null ? "" : `data-toggle="tooltip" data-html="true" class="tooltipText" title='${description}'`}>
                    ${description == null ? "" : description}
                </div> 
            </div>
        </div>
    </div>
    </div>
    `;
}



    
}


