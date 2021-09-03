var express = require('express');
var router = express.Router();
const passport = require('passport');
require('../services/auth/oauth');


router.get('/auth/google/success', function(req, res, next) {
  req.flash("sucess", "Successfully authenticated using Google Accounts");
  req.redirect("/");
});


router.get('/auth/google/failure', function(req, res, next) {
  req.flash("danger", "Something went wrong! Authentication failed!");
  req.redirect("/");
});


router.get('/auth/google/callback',
  passport.authenticate("google", {
    successRedirect:"/auth/google/success",
    failureRedirect:"/auth/google/failure",
  }));
  
router.get('/auth/google',passport.authenticate("google",{scope:["email","profile"]}));

module.exports = router;
