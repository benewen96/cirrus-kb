# Express Handlebars Auth Accelerator v1.0.0

**Application Name:** Express Handlebars Auth Accelerator

**Application Description:** A simple Node / Express accelerator which includes "[Express-Handlebars] (https://www.npmjs.com/package/express-handlebars)", "[New Relic APM] (https://www.npmjs.com/package/newrelic)" and authentication using the [Force.com PassportJS] (https://github.com/joshbirk/passport-forcedotcom) strategy.

**Prefix:** CIRR_EXPRESS_HANDLEBARS_AUTH

**Author:** Jon Thomas / Matthew Bull

**Team:** Cirrus

**Information Classification:** Green

**Development Languages / Frameworks(s):** Node, Express, Handlebars

**Development Add-Ons:** Heroku Redis, New Relic APM

---

**Get Started:**

***Authenitcation Pattern:***

1. If the web app is configured to allow unauthenticated access, requests from the browser are allowed without any authentication.
2. If the web app is configured to require authentication, the user’s browser is redirected to the associated Salesforce.com org for authentication.

***Prerequisites:***

Clone this repository (git clone https://github.com/EliLillyCo/CIRR_EXPRESS_HANDLEBARS_AUTH).

A Force.com Connected App is required to implement this accelerator. Please submit a Service Request to the Cirrus team to request a Connected App be created, specifying your app name and Application URL.

Add the [Heroku Redis] (https://elements.heroku.com/addons/heroku-redis) and [New Relic APM] (https://elements.heroku.com/addons/newrelic) add-ons to your Heroku application. [Papertrail] (https://elements.heroku.com/addons/papertrail) is also recommended, not not required.

***Config Variables:***

* AUTH_REQUIRED = true / false
* CF_CALLBACK_URL = https://<heroku_app_name>.herokuapp.com/auth/forcedotcom/callback
* CF_CLIENT_ID = Force.com Connected App ID
* CF_CLIENT_SECRET = Force.com Connected App Secret
* COOKIE_SECRET = Any Value
* LOG_LEVEL = combined
* NEW_RELIC_LICENSE_KEY = New Relic License Key
* NEW_RELIC_LOG = stdout
* REDIS_URL = Redis URL
* SF_AUTHORIZE_URL = https://<org_my_domain>.salesforce.com/services/oauth2/authorize
* SF_TOKEN_URL = https://<org_my_domain>.my.salesforce.com/services/oauth2/token

***Add Your Pages:***

* views = Handlebars Pages (HTML)
* views/layouts = Handlebars Layouts
* views/partials = Handlebars Partials
* public = Unauthenticated Static Assets (CSS, Fonts, JS, IMG)
* private_static = Authenticated Static Assets (CSS, Fonts, JS, IMG)

---

**Application Dependencies:**

    "body-parser": "~1.13.2",
    "compression": "^1.6.2",
    "connect-redis": "^3.0.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "express": "~4.13.1",
    "express-handlebars": "^3.0.0",
    "express-session": "^1.13.0",
    "method-override": "^2.3.5",
    "morgan": "~1.6.1",
    "newrelic": "^1.28.1",
    "passport": "^0.3.2",
    "passport-forcedotcom": "^0.1.3",
    "redis": "^2.6.0-2",
    "serve-favicon": "~2.3.0"