const express = require("express");
const app = express();
exports.app = app;

require("dotenv").config();

const routes = require("./routes");
const db = require("./database/db");

// Middleware
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// -------------------------------------------------
// MIDDLEWARE (ORDER MATTERS)
// -------------------------------------------------

// Parse cookies
app.use(cookieParser());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  })
);

// -------------------------------------------------
// PASSPORT GITHUB STRATEGY
// -------------------------------------------------

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// -------------------------------------------------
// ROUTES
// -------------------------------------------------

// Swagger — forces logged-out state
app.use(
  "/api-docs",
  (req, res, next) => {
    req.session.user = null;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Root route
app.get("/", (req, res) => {
  res.send(
    req.session.user
      ? `Logged in as ${req.session.user.displayName}`
      : "Not logged in"
  );
});

// GitHub OAuth callback
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: true,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// Attach all app routes
app.use("/", routes);

// -------------------------------------------------
// START SERVER
// -------------------------------------------------

const port = process.env.PORT || 8080;

db.initDb((err) => {
  if (err) {
    console.error("Database init error:", err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server with database running on port ${port}...`);
    });
  }
});
