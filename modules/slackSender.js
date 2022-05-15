const { IncomingWebhook } = require('@slack/client');

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_SENTRY);

const slackSender = err => {
  webhook.send({
    attachments: [
      {
        color: '#ff0000',
        fields: [
          {
            title: `🚨  ${err.message}`,
            value: err.stack,
            short: false,
          },
        ],
        ts: new Date().getTime() / 1000,
      },
    ],
  });
};

module.exports = {
  slackSender,
};
