
var $ = require('jquery');

export default class QueryView {

constructor(domElementForValidationRequired) {
    this.domElementForValidationRequired = domElementForValidationRequired
    this.domElementForValidationRequired.addEventListener('click', () => this.onValidationRequired())
}


onValidationRequired(){
    throw new Error('This is an abstract method, you have to implement it in a derived class!'); 
}

}

