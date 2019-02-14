const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const SpotifyWebApi = require("spotify-web-api-node");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  // redirectUri: 'http://www.example.com/callback'
});

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
              username: profile.displayName,
              spotifyID: profile.id,
              refreshToken,
              email: profile.emails[0].value,
              country: profile.country,
              profileUrl: profile.profileUrl,
              photoUrl: profile.photos[0]
            })
              .then(userCreated => {
                console.log('TCL: userCreated', userCreated)
                spotifyApi.setRefreshToken(userCreated.refreshToken);
                spotifyApi.refreshAccessToken()
                  .then(data => {
                    spotifyApi.setAccessToken(data.body.access_token);
                    return spotifyApi
                      .getMyTopArtists({ limit: 50, offset: 0, time_range: 'long_term' })
                  })
                  .then(gotArtists => {
                    console.log('TCL: gotArtists', gotArtists.body)
                    let favArtists = []
                    let favGenres = []
                    for (let i of gotArtists.body.items) {
                      favArtists.push(i.name)
                      favGenres.push(...i.genres)
                    }
                    userCreated.favArtists = favArtists
                    userCreated.favGenres = favGenres
                    console.log('TCL: userCreated', userCreated)
                    console.log('TCL: favArtists', favArtists)
                    console.log('TCL: userCreated.favArtists', userCreated.favArtists)
                    console.log('TCL: favGenres', favGenres)
                    return User.findOneAndUpdate({ _id: userCreated._id }, { $set: { favArtists: favArtists, favGenres: favGenres } }, { new: true })
                  })
                  .then(artistUpdated => {
                    return done(null, userCreated); // We log in the user that was just created
                  })
                  .catch(err => done(err))
              })
              .catch(err => done(err))
            }
        })
        .catch(err => done(err));
    }
  )
);
