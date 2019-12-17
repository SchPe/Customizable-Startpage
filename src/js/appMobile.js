

import '../styles/bootstrap-select.min.css';
import '../styles/icomoon.css';
import '../styles/theme_1565893338864.css';
import '../styles/styles.css';
import '../styles/styles_mobile.css';


var $ = require('jquery');
require("bootstrap-input-spinner");
require("bootstrap-select");
require('./jquery.ui.touch-punch.min.js')


import SmartphoneMainView from './main/smartphoneMainView.js'
import MainController from './main/mainController.js'



$( function() { 
    'use strict';

    var $modal = $('#exampleModal');

    $modal
        .removeClass('fade')
        .find('.modal-dialog')
        .removeClass('modal-lg')
        .addClass('modal-xl')
        .addClass('modal-dialog-scrollable');

    let mainView = new SmartphoneMainView();
    let mainController;
    if(window.styleLoaded) mainController = new MainController(mainView);
    else window.linkTag.onload = () => {mainController = new MainController(mainView);}

});