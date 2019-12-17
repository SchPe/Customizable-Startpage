
var $ = require('jquery');
import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'
import QueryView from '../main/queryView.js'


const DOM = {$sourcesSelector: $("#sourcesSelector"), $countrySelector: $("#countrySelector"), 
$categorySelector: $("#categorySelector"), $languageSelector: $("#languageSelector"), $newsEntries:$("#newsEntries"), 
$newsWrongInput1:$('#newsWrongInput1'), $newsWrongInput2:$('#newsWrongInput2'), $newsWrongCounterInput:$('#newsWrongCounterInput')} 


export default class NewsQueryView extends QueryView {

constructor(domElementForValidationRequired) {
    super(domElementForValidationRequired)

    if(window.isMobile) {
        DOM.$sourcesSelector.selectpicker('mobile');
        DOM.$countrySelector.selectpicker('mobile');
        DOM.$categorySelector.selectpicker('mobile');
        DOM.$languageSelector.selectpicker('mobile');
    }
    else {
        DOM.$sourcesSelector.selectpicker();
        DOM.$countrySelector.selectpicker();
        DOM.$categorySelector.selectpicker();
        DOM.$languageSelector.selectpicker();
    }
    DOM.$newsEntries.inputSpinner();

}

init() {
    let view = this

    this.getAllSources()

    events.publish(eventTypes.countriesRequired, {view} )

    $('input[type="radio"]').on('click',(e) => this.onSwitchQueryMode(e))
}


showInputAsInvalid(validationResult) {
    switch(validationResult) {
        case 'no country and category':
            DOM.$newsWrongInput1.removeClass('d-none').addClass('d-block');
            break;
        case 'no sources':
            DOM.$newsWrongInput2.removeClass('d-none').addClass('d-block');
            break;
        case 'wrong counter input':
            DOM.$newsWrongCounterInput.removeClass('d-none').addClass('d-block');
            break;
    }
}

unShowInputAsInvalid() {
    DOM.$newsWrongInput1.removeClass('d-block').addClass('d-none');
    DOM.$newsWrongInput2.removeClass('d-block').addClass('d-none');
    DOM.$newsWrongCounterInput.removeClass('d-block').addClass('d-none');        
}

insertSources(sources) {
    DOM.$sourcesSelector.find('.sourcesOption').remove();
    for(let entry of sources) {
        DOM.$sourcesSelector.append(new Option(entry.name, entry.id));
        DOM.$sourcesSelector.find(`[value="${entry.id}"]`).addClass('sourcesOption');
    }
    DOM.$sourcesSelector.selectpicker('refresh');
}

insertCountries(countries) {
    var countrySelector = document.querySelector("#countrySelector");
        for(const countryCode in countries) {
            countrySelector.innerHTML += `<option value="${countryCode}">${countries[countryCode]}</option>` + '\n';
        }
}



onSwitchQueryMode(e) {
    if($(e.target).is('#radio1')) {
            this.unregisterSelectPickerEventListeners()
            // sources und language auf default (not selected, all option als default) zurückstellen und sources and language disable
            DOM.$sourcesSelector.selectpicker('deselectAll').prop('disabled', true);
            DOM.$languageSelector.selectpicker('val', 'all').prop('disabled', true);
            // country und category option all entfernen und default entsprechend stellen (not selected, not selected)
            DOM.$countrySelector.find('[value=all]').remove();
            DOM.$categorySelector.find('[value=all]').remove();
            // updateSources wieder mit all parametern
            $('button[data-id="sourcesSelector"] .filter-option-inner-inner').text("Nothing selected");
            $('button[data-id="sourcesSelector"] .filter-option-inner-inner').css("color", "black");       
            this.getAllSources()
            this.refreshSelectPickers()
    }
    else if($(e.target).is('#radio2')) {
            DOM.$categorySelector.append(new Option("All", "all")).selectpicker('val', 'all');
            DOM.$countrySelector.append(new Option("All", "all")).selectpicker('val', 'all');
            DOM.$sourcesSelector.prop('disabled', false);
            DOM.$languageSelector.prop('disabled', false);
            this.registerSelectPickerEventListeners()
            this.refreshSelectPickers()
    }
}

getAllSources() {
    const view = this;
    const query = {country:'all', category:'all', language:'all'};
    events.publish(eventTypes.sourcesRequired, {view, query} )
}

registerSelectPickerEventListeners() {
    DOM.$countrySelector.on('changed.bs.select', () => this.selectEventHandler())
    DOM.$categorySelector.on('changed.bs.select', () => this.selectEventHandler())
    DOM.$languageSelector.on('changed.bs.select', () => this.selectEventHandler())
}

unregisterSelectPickerEventListeners() {
    DOM.$countrySelector.off('changed.bs.select');
    DOM.$categorySelector.off('changed.bs.select');
    DOM.$languageSelector.off('changed.bs.select');
}


refreshSelectPickers() {
    DOM.$sourcesSelector.selectpicker('refresh');
    DOM.$languageSelector.selectpicker('refresh');
    DOM.$categorySelector.selectpicker('refresh');
    DOM.$countrySelector.selectpicker('refresh');
}

selectEventHandler() {
    const view = this
    const query = {
        country: DOM.$countrySelector.selectpicker('val'),
        category: DOM.$categorySelector.selectpicker('val'),
        language: DOM.$languageSelector.selectpicker('val')
    }
    events.publish(eventTypes.sourcesRequired, {view, query} )

}



showThatThereAreNoSources() {
    $('button[data-id="sourcesSelector"] .filter-option-inner-inner').text("No Sources");
    $('button[data-id="sourcesSelector"] .filter-option-inner-inner').css("color", "red");     
}

unShowThatThereAreNoSources() {
    $('button[data-id="sourcesSelector"] .filter-option-inner-inner').text("Nothing selected");
    $('button[data-id="sourcesSelector"] .filter-option-inner-inner').css("color", "black");
}


onValidationRequired(){
    if(document.querySelector(".tab-pane.active").id === "news") {
        let view = this
        let query = this.createQuery();
        events.publish(eventTypes.validationRequired, {view, query} )

    }
}

createQuery() {
    let query = {}
    query.type = 'news'
    let pageSize = DOM.$newsEntries.val();
    var radioActive = document.querySelector("input[name='customRadioInline1']:checked");
    if(radioActive.id==="radio1") return this.createQueryByCountryAndCategory(query, pageSize)
    else if(radioActive.id==="radio2") return this.createQueryBySource(query, pageSize)
}

createQueryByCountryAndCategory(query, pageSize) {
    query.selectNewsBy = 'country and/or category'
    let countrySelector = DOM.$countrySelector[0];
    let categorySelector = DOM.$categorySelector[0];
    let country = countrySelector.options[countrySelector.selectedIndex].value;
    let category = categorySelector.options[categorySelector.selectedIndex].value;
    query.newsQueryObject = {country, category, pageSize}
    return query;
}

createQueryBySource(query, pageSize){
    query.selectNewsBy = 'sources'
    let sources = DOM.$sourcesSelector.find(':selected').map(function() { return this.value }).toArray().join(",");
    let sourcesText = DOM.$sourcesSelector.find(':selected').map(function() { return this.textContent }).toArray().join(", ");
    query.newsQueryObject = {sources, sourcesText, pageSize}
    return query
}

}

