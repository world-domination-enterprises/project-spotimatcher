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

app.get('/auth/spotify', passport.authenticate('spotify'), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

//  Scopes: 
//  user-top-read => Read access to a user's top artists and tracks.
//  user-read-birthdate => Read access to the user's birthdate.
//  user-read-private => reading country and product subscription level
//  user-read-email => email


app.get('/login', (req, res, next) => {
  const my_client_id = 'b0564b64166e409680d97cb7fafe9942'
  var scopes = 'user-top-read user-read-email user-read-birthdate user-read-private';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
  });

//  after authentication spotify sends user back to redirect URI; display info: succes or failure message  
app.get('https://example.com/callback', (req, res, next) => {
  const {code} = req.query
  res.render('auth-succes', {message: true}) //  display success message; buttons: match, profile
})

app.get('https://example.com/callback?error=access_denied', (req, res, next) => {
  res.redirect('/login', {message: true}) //  display failure message: 'You must authenticate with spotify account to use this service.' 
})

app.post('https://accounts.spotify.com/api/token', function(req, res) {
  req.body = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri, //  TODO: create URI
    client_id: 'b0564b64166e409680d97cb7fafe9942',
    client_secret: '773a717943c846a390c132c13b9ae2af' 
  }
})  



module.exports = router;
