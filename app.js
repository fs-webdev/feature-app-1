var express = require('express')
  , featureClient = require('feature-client');

var app = express()
  , devKey = process.env.FEATURE_DEVKEY || ''
  , PORT = process.env.PORT || 5000;

var featureConfig = {
  experiments: [
    'basicExp',
    { name: 'objectedExp', },
    { name: 'defaultedExp', default: true },
    {
      name: 'moreInfoExp',
      description: 'Here is my description. If you want to see more, good for you.',
    },
    'reallyNewExp',
  ],
  shared: {
    repo: 'fs-webdev/theme-engage',
    experiments: [
      'sharedExp1',
      { name: 'sharedExp2', },
    ],
  }
  // subscription: 'push',
  // subscription: 300000,
};

var feature = featureClient.configure(featureConfig);

app.get('/', function(req, res) {
  res.send(418);
});

feature.announce(function(err, data) {
  var msg = 'i\'s ready! u\'s ready?';
  if (err) {
    console.error('App Crashing!: ', err);
    msg = 'ready anyway... fail';
  }
  app.listen(PORT, function() {
    console.info(msg);
  });
});
