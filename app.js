var express = require('express')
  , featureClient = require('feature-client');

var app = express()
  , devKey = process.env.FEATURE_DEVKEY || ''
  , PORT = process.env.PORT || 5000;

var featureConfig = {
  name: 'sampleApp',
  devKey: devKey,
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
  // subscription: 'push',
  // subscription: 300000,
};

var feature = featureClient.configure(featureConfig);

app.get('/', function(req, res) {
  res.send(418);
});

feature.announce().then(function() {
  app.listen(PORT, function() {
    console.info('i\'s ready! u\'s ready?');
  });
}, function(err) {
  console.error('App Crashing!: ', err);
  app.listen(PORT, function() {
    console.info('ready anyway... fail');
  });
});
