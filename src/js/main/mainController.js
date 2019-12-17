

import events from '../util/events.js'
import eventTypes from '../util/eventTypes.js'

import CacheController from './cacheController.js'
import DataToServerSender from './dataToServerSender.js'

import initServiceWorker from './serviceWorker'


import {controllerConstructorMap, viewTypes} from './plugins.js'
var controllerMap = new Map();

export default class MainController {


    constructor (mainView) {
                this.mainView = mainView;
                events.subscribe(eventTypes.validationRequired, (e) => this.onValidationRequired(e))
                events.subscribe(eventTypes.newViewRequired, (e) => this.createNewView(e))
                events.subscribe(eventTypes.newView, (e) => this.onNewView(e))
                


            this.cacheController = new CacheController(mainView.getType());
                controllerMap.set(viewTypes.news, controllerConstructorMap[viewTypes.news]())



                this.cacheController.updateCache()
                this.mainView.createViewsFromCache(this.cacheController.getCacheData().cards)

                events.subscribe(eventTypes.finishedLoading, (view) => this.mainView.wrapUpView(view))

                this.mainView.init()

                this.dataToServerSender = new DataToServerSender(this.cacheController)

                initServiceWorker(); 
    }


    onValidationRequired(e) { 
        if(controllerMap.get(e.query.type) == null) controllerMap.set(e.query.type, controllerConstructorMap[e.query.type]())
        controllerMap.get(e.query.type).validate(e)
    }

    createNewView(e) {
        this.mainView.hideQueryView()
        this.mainView.createNewView(e)  
    }

    async onNewView(e) {
        if(controllerMap.get(e.query.type) == null) controllerMap.set(e.query.type, controllerConstructorMap[e.query.type]())

        const controller = controllerMap.get(e.query.type)
        controller.attachView(e.view)
        await controller.showContent(e.view, e.query)
    }
}