var express = require('express')
  , cookieParser = require('cookie-parser')
  , featureClient = require('feature-client')
  , xprExpress = require('xpr-express')
  , xprToggle = require('xpr-toggle');

// XPRMNTL plugins
featureClient.use(xprExpress());
featureClient.use(xprToggle());

var app = express()
  , PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(function(req, res, next) {
  req.user = {
    id: 'myID',
    name: 'Test McTesters',
  };
  next();
});

app.use(featureClient.express);
app.use(featureClient.toggle);

var featureConfig = {
  timeout: 10000,
  reference: 'local',
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
    experiments: [
      'sharedExp1',
      { name: 'sharedExp2', },
    ],
  }
};

app.get('/', function(req, res, next) {
  if (req.feature('basicExp')) {
    return next();
  }

  res.sendStatus(418);
});

app.use(express.static('./public'));

featureClient
  .configure(featureConfig)
  // .cron('*/15 * * * * *', function(err, exp) {
  //   console.log('MOAR', exp);
  // })
  .announce(function(err, data) {

    var msg = 'i\'s ready! u\'s ready?';
    if (err) {
      console.error('App Crashing!: ', err);
      msg = 'ready anyway... fail';
    }
    console.log(data);
    app.listen(PORT, function() {
      console.info(msg);
    });
  });
