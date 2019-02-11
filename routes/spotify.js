const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  // redirectUri: 'http://www.example.com/callback'
});

// TODO: protect the route so that only connected people can access it
router.get("/test", (req, res, next) => {
  spotifyApi.setRefreshToken(req.user.refreshToken);
  spotifyApi.refreshAccessToken().then(data => {
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi
      .getFollowedArtists()
      .then(data => {
        res.render("spotify/test", {
          data: JSON.stringify(data, null, 2)
        });
      })
      .catch(next);
  });
});

module.exports = router;
