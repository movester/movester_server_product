const express = require('express');

const app = express();
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routes');
const { slackSender } = require('./modules/slackSender');
const CODE = require('./utils/statusCode');
const MSG = require('./utils/responseMessage');
const form = require('./utils/responseForm');
require('dotenv').config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);
app.use('/api', router);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      slackSender(error);
      return true;
    },
  })
);

app.use((err, req, res, next) => {
  res.status(CODE.INTERNAL_SERVER_ERROR).json(form.fail(MSG.INTERNAL_SERVER_ERROR));
  next();
});

module.exports = app;
