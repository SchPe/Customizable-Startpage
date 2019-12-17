const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const User = require('../models/User');

require('dotenv').config()
const fs = require('fs');

const fileLocations = require('../config/fileLocations.js');

const nav_contentLoggedOut = fs.readFileSync(fileLocations.navContentLoggedOut, "utf8");
const nav_contentLoggedIn = fs.readFileSync(fileLocations.navContentLoggedIn, "utf8");


require('marko/node-require').install();
require('marko/express'); //enable res.marko
const indexTemplate = require(fileLocations.indexTemplate);


router.get('/', (req, res) => {
  if(req.isAuthenticated()) {
    res.marko(indexTemplate, {
      nav_content: nav_contentLoggedIn,
      data: req.user.data,
      idtoken: req.user._id
    }); 
  } else {
    res.marko(indexTemplate, {
      nav_content: nav_contentLoggedOut
    }); 
  }
});

module.exports = router;
