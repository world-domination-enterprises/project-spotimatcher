const passport      = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'https://spotimatcher.herokuapp.com/auth/login/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);