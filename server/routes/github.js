const express = require('express');
const router = express.Router();
const axios = require('axios')

require('dotenv').config()

process.env.GITHUB_CLIENT_ID
process.env.GITHUB_CLIENT_SECRET

router.get('/oauth/redirect', (req, res) => {

    const requestToken = req.query.code
    axios({
      method: 'post',

      url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`,
      headers: {
           accept: 'application/json'
      }
    }).then((response) => {

      const accessToken = response.data.access_token

      res.redirect(`/?access_token=${accessToken}&github`)
    })
  })
  

module.exports = router;
