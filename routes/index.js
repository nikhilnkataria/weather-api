/* eslint-disable no-console */
const express = require('express');
const request = require('request');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Utils = require('../helpers/utils');
const Weather = require('../helpers/weather');
const httpStatusCodes = require('../config/httpStatusCodes');

/**
 * Get City Weather Data from City ID provided by open weather
 * @route GET /
 * @param {string} cityId.query.required - city id eg: 5815135
 * @returns {object} 200 - An array of city details and weather info
 * @returns {Error}  default - Unexpected error
 */
router.get('/', [ check('cityId').isNumeric() ], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatusCodes.HTTP_BAD_REQUEST).json(
      Utils.generateResponse(
        {
          errors: errors.array()
        },
        httpStatusCodes.HTTP_BAD_REQUEST,
        'Invalid Request'
      )
    );
  }
  const { cityId } = req.query;
  const url = Weather.getForeCastApiUrl('id', cityId);
  request(url, (err, response, body) => {
    // eslint-disable-next-line no-param-reassign
    body = JSON.parse(body);
    if (err) {
      res
        .status(httpStatusCodes.HTTP_BAD_REQUEST)
        .json(
          Utils.generateResponse({}, httpStatusCodes.HTTP_BAD_REQUEST, err)
        );
    } else {
      const status = body.cod;
      let bodyResponse = { data: {}, status, message: body.message };
      if (parseInt(status) === httpStatusCodes.HTTP_OK) {
        bodyResponse = Utils.generateResponse(
          Weather.generateWeatherInfo(body),
          status
        );
      }
      res.status(status).json(bodyResponse);
    }
  });
});

/**
 * Get multiple city weather info where city id is provided by open weather
 * @route GET /multiple-city
 * @param {string} cityId.query.required - city id eg: 5815135,5128581
 * @returns {object} 200 - An array of city details and weather info
 * @returns {Error}  default - Unexpected error
 */
router.get(
  '/multiple-city',
  [
    check('cityId').exists().bail().custom((cityIdStr) => {
      const cityArr = cityIdStr.split(',');
      return cityArr.every(
        (city) => (city === '' || parseInt(city) === NaN ? false : true)
      );
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCodes.HTTP_BAD_REQUEST).json(
        Utils.generateResponse(
          {
            errors: errors.array()
          },
          httpStatusCodes.HTTP_BAD_REQUEST,
          'Invalid Request'
        )
      );
    }

    const { cityId } = req.query;
    const url = Weather.getForeCastApiUrl('id', cityId, 'group');
    request(url, (err, response, body) => {
      body = JSON.parse(body);
      if (err) {
        res
          .status(httpStatusCodes.HTTP_BAD_REQUEST)
          .json(
            Utils.generateResponse({}, httpStatusCodes.HTTP_BAD_REQUEST, err)
          );
      } else {
        let data = {};
        let bodyStatusCode = httpStatusCodes.HTTP_OK;
        if (body.cod && body.cod == httpStatusCodes.HTTP_NOT_FOUND) {
          data = Utils.generateResponse(
            Weather.generateMultipleCityData({}),
            httpStatusCodes.HTTP_NOT_FOUND,
            body.message
          );

          bodyStatusCode = httpStatusCodes.HTTP_NOT_FOUND;
        } else {
          data = Utils.generateResponse(
            Weather.generateMultipleCityData(body),
            httpStatusCodes.HTTP_OK
          );
        }

        res.status(bodyStatusCode).send(data);
      }
    });
  }
);

module.exports = router;
