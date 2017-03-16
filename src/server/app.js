var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

const simpleOauthModule = require('simple-oauth2');

const github_oauth2 = simpleOauthModule.create({
    client: {
        id: "ccd767b7a1b5f73c84b7",
        secret: "bf59978a223ca67fc59684f63de493f7ab7e62e9",
    },
    auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
    },
});

const authorizationUri = github_oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/githubCallback',
    scope: "notifications,user,gist,repo",
});

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ajanda');

var db = mongoose.connection;
mongoose.Promise = global.Promise;

var User = require('./user.model.js');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');

    app.get('/githubAuth', (req, res) => {
        res.redirect(authorizationUri);
    })

    app.get('/githubCallback', (req, res) => {
        const code = req.query.code;
        const options = {
            code,
        };

        github_oauth2.authorizationCode.getToken(options, (error, result) => {
            if (error) {
                console.error('Access Token Error', error.message);
                return res.json('Authentication failed');
            }

            const token = github_oauth2.accessToken.create(result);

            // TODO: update logged in users githubToken info.
            User.findOne({ username: "admin" }, function (err, u) {
                if (err) return console.error(err);

                User.update({ username: "admin" }, {
                    githubToken: token.token.access_token
                }, function (err, raw) {
                    if (err) return console.error(err);
                });
            });

            return res.redirect("/");
        });
    });

    // all other routes are handled by Angular
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '/../../dist/index.html'));
    });

    app.listen(app.get('port'), function () {
        console.log('Ajanda listening at ' + app.get('port'));
    });
});

module.exports = app;
