const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

require('dotenv').config()


router.get('/content', async (req, res) => {
  try {
    const i = req.url.indexOf('?')
    const query = req.url.substr(i+1)
    let data = await fetch(`https://newsapi.org/v2/top-headlines?${query}`, {
        headers: {
            'x-api-key': process.env.NEWS_API_KEY
        }
    });
    data = await data.json();
    res.send({data});
  }catch(err) {
    console.error(err.msg);
  }
});


router.get('/sources', async (req, res) => {
  try {
    const i = req.url.indexOf('?')
    const query = req.url.substr(i+1)
    let data = await fetch(`https://newsapi.org/v2/sources?${query}`, {
      headers: {
          'x-api-key': process.env.NEWS_API_KEY
      }
    });
    data = await data.json();
    res.send({data});
  } catch(err) {
    console.error(err.msg);
  }
});


module.exports = router;
