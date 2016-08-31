var REDIS_URL = process.env.REDIS_URL;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var client = require('redis').createClient(process.env.REDIS_URL);

// Passport does not directly manage your session, it only uses the session.
// So you configure session attributes (e.g. life of your session) via express
var sessionOpts = {
	saveUninitialized: false, // saved new sessions
	resave: false, // do not automatically write to the session store
	store: new RedisStore({
		client: client
	}),
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		maxAge: 1800000
	}
}

module.exports = function(app) {
	return app.use(session(sessionOpts));
};