const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// router.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.flash("error") });
// });

// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup");
// });

// router.post("/signup", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username === "" || password === "") {
//     res.render("auth/signup", { message: "Indicate username and password" });
//     return;
//   }

//   User.findOne({ username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", { message: "The username already exists" });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username,
//       password: hashPass
//     });

//     newUser.save()
//     .then(() => {
//       res.redirect("/");
//     })
//     .catch(err => {
//       res.render("auth/signup", { message: "Something went wrong" });
//     })
//   });
// });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Spotify Authentication

router.get('/spotify', passport.authenticate('spotify', {
  scope: [
    'user-follow-read', // https://developer.spotify.com/documentation/general/guides/scopes/#user-follow-read
    'user-top-read', // https://developer.spotify.com/documentation/general/guides/scopes/#user-top-read
    'user-read-birthdate', // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-birthdate
    'user-read-private', // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-private
    'user-read-email', // https://developer.spotify.com/documentation/general/guides/scopes/#user-read-email
  ]
}));

router.get('/spotify/callback',
  passport.authenticate('spotify', { 
    failureRedirect: '/login',
    successRedirect: '/',
  })
);

//  Scopes: 
//  user-top-read => Read access to a user's top artists and tracks.
//  user-read-birthdate => Read access to the user's birthdate.
//  user-read-private => reading country and product subscription level
//  user-read-email => email



module.exports = router;
