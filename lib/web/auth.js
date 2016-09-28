const passport = require('passport');
const ForceDotComStrategy = require('passport-forcedotcom').Strategy;
const methodOverride = require('method-override');
const util = require('util');
const https = require('https');
const path = require('path');

const PERMISSION_SET_NAME = process.env.PERMISSION_SET_NAME;
const AUTH_REQUIRED = (process.env.AUTH_REQUIRED == 'true');

module.exports = function (app) {
  return {

    init() {
      passport.serializeUser((user, done) => {
        done(null, user);
      });

      passport.deserializeUser((obj, done) => {
        done(null, obj);
      });

			// Use the ForceDotComStrategy within Passport
      const sfStrategy = new ForceDotComStrategy({
        clientID: process.env.CF_CLIENT_ID,
        clientSecret: process.env.CF_CLIENT_SECRET,
        callbackURL: process.env.CF_CALLBACK_URL,
        authorizationURL: process.env.SF_AUTHORIZE_URL,
        tokenURL: process.env.SF_TOKEN_URL,
        profileFields: ['user_id', 'first_name'],
      }, (accessToken, refreshToken, profile, done) => {
				// Only retain the profile properties we need.
        profile.user_id = profile._raw.user_id;
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

    registerRoutes() {
      app.get('/auth/forcedotcom', (req, res, next) => {
        if (req.query.redirect)
          req.session.authRedirect = req.query.redirect;
        passport.authenticate('forcedotcom')(req, res, next);
      });

      app.get('/auth/forcedotcom/callback', passport.authenticate('forcedotcom', {
        failureRedirect: '/error',
      }), (req, res) => {
				// res.redirect('/');
        const redirect = req.session.authRedirect;
        if (redirect)
          delete req.session.authRedirect;
        res.redirect(303, redirect || '/');
      });

      app.get('/', (req, res) => {
        if ((!req.user) && (AUTH_REQUIRED)) {
          req.session.destroy();
          req.logout();
          return res.redirect('/auth/forcedotcom');
        }
        res.render('index');
      });

      app.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        return res.render('logout');
      });
    },

    ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated() || !AUTH_REQUIRED) {
        return next();
      }
      res.redirect(`/auth/forcedotcom?redirect=${req.originalUrl}`);
    },
  };
};
