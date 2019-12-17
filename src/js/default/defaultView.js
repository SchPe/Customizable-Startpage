var $ = require('jquery');
import View from '../main/view.js'




    
export default class DefaultView extends View  {

    constructor(mainDomElement, id) {
        super(mainDomElement, id)
        
    }

    showContent (content) {
        this.mainDomElement.innerHTML = content;
    }



}