const weatherConfigs = require('../config/weather');

const Weather = {
  getForeCastApiUrl: (key, val) => {
    return `${weatherConfigs.baseUrl + weatherConfigs.foreCastParams}?APPID=${
      weatherConfigs.apiKey
    }&${key}=${val}`;
  }
};

module.exports = Weather;
