const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("../routes/index");
const cookieParser = require("cookie-parser");
const redis = require("redis");
const passport = require("passport");

const port = process.env.PORT || 5000;
const redisPort = process.env.PORT || 6379;

const client = redis.createClient(redisPort);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use("/", router);

app.listen(port, () => console.log(`Prod Server listening on port ${port}!`));
