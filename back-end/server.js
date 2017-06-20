var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');

var config     = require('./config');
var User       = require('./app/models/user');

var port = process.env.PORT || 8080;

mongoose.connect(config.database);

app.set('secret_key', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to Ajanda API!' });
});

apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User could not found.' });
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = jwt.sign(user, app.get('secret_key'), {
          expiresIn: 60*60 // 1hr
        });

        res.json({
          success: true,
          message: 'Enjoy your api token!',
          token: token
          // TODO: return user id or something similar to identify user further requests. (try jwt way first)
        });
      }
    }
  });
});

apiRoutes.post('/register', function(req, res) {
  // TODO: check if ther is existing user with the same username.
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    admin: false,
    gh_token: ''
  });

  user.save(function(err) {
    if (err) throw err;

    console.log('User [' + user.username + ':' + user.password + '] saved successfully.');

    res.json({ success: true });
  });
});

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('secret_key'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRoutes.get('/me', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('secret_key'), function(err, decoded) {
      if (!err) {
        res.json(decoded._doc);
      }
    });
  }
});

apiRoutes.get('/me/getGitHubToken', function(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('secret_key'), function(err, decoded) {
      if (!err) {
        res.json(decoded._doc.gh_token);
      }
    });
  }
});

app.use('/api', apiRoutes);

app.listen(port);

console.log('Server listening at http://localhost:' + port);
