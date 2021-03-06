# Cirrus KB v0.5

**Application Name:** Cirrus Knowledge Base

**Application Description:** A Markdown powered knowledge base for the Cirrus team to share useful development information and to learn about problems in various development environments commonly faced by the Cirrus team.

**Prefix:** CIRR_KB

**Author:** Ben Ewen

**Team:** Cirrus

**Information Classification:** -

**Development Languages / Frameworks(s):** Node, Express, Handlebars

**Development Add-Ons:** -

**Development Notes:**
* This application is primarily driven by:
 *  Express, Handlebars (and it's helpers), and body-parser to handle feeding user input to the server.
*  It's worth noting that this (currently) stores files locally, which is an issue if persistent storage is not available.
*  The front-end is built with:
	*  [https://bootflat.github.io/ ](https://bootflat.github.io/)for the layout
	*  [https://simplemde.com/](https://simplemde.com/) for the markdown editor

---

**Get Started:**

1. `npm install`
2. `heroku local`
3.  `http://localhost:5000`



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
