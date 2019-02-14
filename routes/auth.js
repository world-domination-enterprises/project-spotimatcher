const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Spotify Authentication

router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: [
      "user-follow-read", // https://developer.spotify.com/documentation/general/guides/scopes/#user-follow-read
      "user-top-read", // https://developer.spotify.com/documentation/general/guides/scopes/#user-top-read
      "user-read-birthdate", // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-birthdate
      "user-read-private", // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-private
      "user-read-email" // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-email
    ],
    showDialog: true
  })
);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "/",
    failureMessage: true,
    successRedirect: "/profile",
    successMessage: true
  })
);

//  Scopes:
//  user-top-read => Read access to a user's top artists and tracks.
//  user-read-birthdate => Read access to the user's birthdate.
//  user-read-private => reading country and product subscription level
//  user-read-email => email

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

//TODO: find a way to log user out with spotify

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});

module.exports = router;
