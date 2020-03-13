const _ = require('lodash');
const weatherConfigs = require('../config/weather');

const Weather = {
  getForeCastApiUrl: (key, val, type = 'forecast') => {
    return `${weatherConfigs.baseUrl +
      weatherConfigs.foreCastParams}/${type}?APPID=${weatherConfigs.apiKey}&units=metric&${key}=${val}`;
  },
  generateWeatherInfo: ({ city, list }) => {
    const resp = {
      details: {
        timezone: city.timezone,
        sunrise: city.sunrise,
        sunset: city.sunset,
        coord: city.coord,
        wind: !_.isEmpty(list) ? { ...list[0].wind } : {},
        humidity: !_.isEmpty(list) ? list[0].main.humidity : 0,
        pressure: !_.isEmpty(list) ? list[0].main.pressure : 0,
        weather: !_.isEmpty(list) ? list[0].weather[0].description : ''
      },
      list: list.map((item) => ({
        dt_txt: item.dt_txt,
        temp: item.main.temp
      }))
    };

    return resp;
  },
  generateMultipleCityData: ({ list }) => {
    let resp = {};
    if (list) {
      resp = {
        list: list.map((item) => ({
          name: item.name,
          country: item.sys.country,
          timezone: item.sys.timezone,
          coord: item.coord,
          wind: item.wind,
          weather: item.weather,
          id: item.id
        }))
      };
    }

    return resp;
  }
};

module.exports = Weather;
