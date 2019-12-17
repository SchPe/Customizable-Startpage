
import '../styles/bootstrap-select.min.css';
import '../styles/icomoon.css';
import '../styles/theme_1565893338864.css';
import '../styles/styles.css';
import '../styles/styles_desktop.css';




// import '../styles/styles_legacy.css';


var $ = require('jquery');
require("bootstrap-input-spinner");
require("bootstrap-select");
require('./jquery.ui.touch-punch.min.js')


// require('webpack-jquery-ui/resizable');
// import fetch from 'unfetch';
// import 'url-search-params-polyfill';
// window.fetch = fetch;


import DesktopMainView from './main/desktopMainView.js'
import MainController from './main/mainController.js'




$( function() { 
    'use strict';

    let mainView = new DesktopMainView();
    let mainController; 
    if(window.styleLoaded) mainController = new MainController(mainView);
    else window.linkTag.onload = () => {mainController = new MainController(mainView);}
});