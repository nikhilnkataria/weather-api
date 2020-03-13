const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSwagger = require('express-swagger-generator');

const indexRouter = require('./routes/index');
const swaggerOptions = require('./config/swaggerOptions');

const app = express();
const expressSwaggerApp = expressSwagger(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
expressSwaggerApp(swaggerOptions);

module.exports = app;
