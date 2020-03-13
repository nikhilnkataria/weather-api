const common = require('./common');
module.exports = {
  swaggerDefinition: {
    info: {
      title: 'Weather API Docs',
      version: '1.0.0'
    },
    basePath: '/',
    schemes: [ 'http' ],
    produces: [ 'application/json' ],
    host: `localhost:${common.port}`
  },
  basedir: __dirname, //app absolute path
  files: [ '../routes/**/*.js' ]
};
