const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Match = require("../models/Match");
const countrynames = require('countrynames')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
//ROUTE about page
router.get("/about", (req, res, next) => {
  res.render("about");
});

//ROUTE going to our PROFILE
router.get("/profile", (req, res, next) => {
  const user = req.user
  
  //  sort the user's favGenres by frequency (high to low)
  let counts = {}
  let genresToSort = user.favGenres
  genresToSort.forEach(x => { counts[x] = (counts[x] || 0)+1; })
  let genresSorted = Object.keys(counts).sort((a, b) => {return counts[b] - counts[a]})

  //  create users Top Ten Artists/Genres
  const topTenArtists = []
  const topTenGenres = []
  for (let i = 0; i < 10; i++) {
    topTenArtists.push(user.favArtists[i])
    topTenGenres.push(genresSorted[i])
  }

  res.render("profile", { 
    user,
    // converts countrycode to full country name
    countryName: countrynames.getName(req.user.country).toLowerCase(),
    topTenArtists,
    topTenGenres
  })
});

//ROUTE going to our RESULTS-Page
//TODO: implement matching-function here
router.get("/results", (req, res, next) => {

  //  match favArtist and favGenre arrays against eachother by using the following funtion:
  // function matches(arr){
  //   var counts = {};
  //   arr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  //   let matchedKeys = Object.keys(counts).filter(key => counts[key] > 1)
  //   return matchedKeys
  //   }

  res.render("results");
});

//ROUTE for a users PROFILE-page
router.get("/profile/:id", (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      console.log("User--", user);
      res.render("profile", { user });
    })
    .catch(err => console.log("Error getting Userdata--", err));
});

module.exports = router;
