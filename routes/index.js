/* eslint-disable no-console */
const express = require('express');
const request = require('request');

const Weather = require('../helpers/weather');

const router = express.Router();
router.get('/', (req, res) => {
  const url = Weather.getForeCastApiUrl('q', 'portland');
  request(url, (err, response, body) => {
    if (err) {
      console.log(`error: ${err}`);
    } else {
      res.send(body);
    }
  });
});

module.exports = router;
