const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "/auth/spotify/callback"
    },
    // The following function is triggered just after the user logged in from Spotify and accepted the conditions
    (accessToken, refreshToken, expiresIn, profile, done) => {
      console.log("DEBUG SpotifyStrategy called");
      console.log("TCL: profile", profile);
      console.log("TCL: expiresIn", expiresIn);

      User.findOne({ spotifyID: profile.id })
        .then(user => {
          // If we have found a user in the database
          if (user) {
            return done(null, user); // We log in the user found in the database
          } else {
            User.create({
              // username: profile.displayName,
              spotifyID: profile.id,
              refreshToken,
              // email: profile.emails[0].value,
              country: profile.country,
              profileUrl: profile.profileUrl,
              photoUrl: profile.photos[0]
              // TODO: also insert the photoUrl, profileUrl, ...

            }).then(userCreated => {
							console.log('TCL: userCreated', userCreated)
              return done(null, userCreated); // We log in the user that was just created
            });
          }
        })
        .catch(err => done(err));
    }
  )
);
