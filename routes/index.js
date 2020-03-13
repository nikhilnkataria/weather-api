/* eslint-disable no-console */
const express = require('express');
const request = require('request');
const { check, validationResult } = require('express-validator');

const Weather = require('../helpers/weather');
const Utils = require('../helpers/utils');

const router = express.Router();

router.get(
  '/:type/:cityId',
  [ check('type').isString(), check('cityId').isNumeric() ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        Utils.generateResponse(
          {
            errors: errors.array()
          },
          422,
          'Invalid Request'
        )
      );
    }
    const { cityId, type } = req.params;
    const url = Weather.getForeCastApiUrl(type, cityId);
    request(url, (err, response, body) => {
      body = JSON.parse(body);
      if (err) {
        res.status(400).json(Utils.generateResponse({}, 400, err));
      } else {
        let status = body.cod;
        let response = { data: {}, status, message: body.message };
        if (status === '200') {
          response = Utils.generateResponse(
            Weather.generateWeatherInfo(body),
            status
          );
        }
        res.status(status).json(response);
      }
    });
  }
);

router.get(
  '/multiple-city',
  [
    check('cityId')
      .exists()
      .bail()
      .isArray()
      .bail()
      .custom((a) => {
        return a.every((e) => (e === '' ? false : true));
      })
      .withMessage('Invalid City Id')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        Utils.generateResponse(
          {
            errors: errors.array()
          },
          422,
          'Invalid Request'
        )
      );
    }

    const { cityId } = req.query;
    const cityIdStr = cityId.join();
    const url = Weather.getForeCastApiUrl('id', cityIdStr, 'group');
    request(url, (err, response, body) => {
      body = JSON.parse(body);
      if (err) {
        res.status(400).json(Utils.generateResponse({}, 400, err));
      } else {
        let data = Utils.generateResponse(
          Weather.generateMultipleCityData(body),
          200
        );
        res.status(200).send(data);
      }
    });
  }
);

module.exports = router;
