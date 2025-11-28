const router = require("express").Router();
const passport = require("passport");



router.get("/", (req, res) => {
    //#swagger.tags=['Hello from Dungeons Tales API']
    res.send("Hello from Dungeons Tales API");
});

router.use('/', require('./swagger.js'))

router.use('/masters', require('./masters'));

router.use('/stories', require('./stories'));

router.get('/login', passport.authenticate('github'), (req, res) => {
    res.redirect("/");
});

router.get('/logout', function (req, res, next){
    req.logout(function(err){
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router