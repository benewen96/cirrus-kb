var passport = require('passport');
var ForceDotComStrategy = require('passport-forcedotcom').Strategy;
var methodOverride = require('method-override');
var util = require('util');
var https = require('https');
var path = require('path');

var PERMISSION_SET_NAME = process.env.PERMISSION_SET_NAME;
var AUTH_REQUIRED = (process.env.AUTH_REQUIRED == 'true');

module.exports = function(app) {

	return {

		init: function() {

			passport.serializeUser(function(user, done) {
				done(null, user);
			});

			passport.deserializeUser(function(obj, done) {
				done(null, obj);
			});

			// Use the ForceDotComStrategy within Passport
			var sfStrategy = new ForceDotComStrategy({
				clientID: process.env.CF_CLIENT_ID,
				clientSecret: process.env.CF_CLIENT_SECRET,
				callbackURL: process.env.CF_CALLBACK_URL,
				authorizationURL: process.env.SF_AUTHORIZE_URL,
				tokenURL: process.env.SF_TOKEN_URL,
				profileFields: ['user_id', 'first_name']
			}, function(accessToken, refreshToken, profile, done) {

				// Only retain the profile properties we need.
				profile["user_id"] = profile._raw.user_id;
				delete profile._raw;
				delete profile.displayName;
				delete profile.name;
				delete profile.emails;

				return done(null, profile);

			});

			passport.use(sfStrategy);

			app.use(passport.initialize());
			app.use(passport.session());

		},

		registerRoutes: function() {

			app.get('/auth/forcedotcom', function(req, res, next) {
				if (req.query.redirect)
					req.session.authRedirect = req.query.redirect;
				passport.authenticate('forcedotcom')(req, res, next);
			});

			app.get('/auth/forcedotcom/callback', passport.authenticate('forcedotcom', {
				failureRedirect: '/error'
			}), function(req, res) {
				//res.redirect('/');
				var redirect = req.session.authRedirect;
				if (redirect)
					delete req.session.authRedirect;
				res.redirect(303, redirect || '/');
			});

			app.get('/', function(req, res) {
				if ((!req.user) && (AUTH_REQUIRED)) {
					req.session.destroy();
					req.logout();
					return res.redirect('/auth/forcedotcom');
				}
				res.render('create');
			});

			app.get('/logout', function(req, res) {
				req.logout();
				req.session.destroy();
				return res.render('logout');
			});

		},

		ensureAuthenticated : function (req, res, next) {
			if (req.isAuthenticated() || !AUTH_REQUIRED) {
    				return next();
  			}
  			res.redirect('/auth/forcedotcom?redirect='+req.originalUrl);
		}
	}
}
