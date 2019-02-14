const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Match = require("../models/Match");
const countrynames = require("countrynames");
const isConnected = require("../middlewares");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
//ROUTE about page
router.get("/about", (req, res, next) => {
  res.render("about");
});

//ROUTE going to our PROFILE
router.get("/profile", isConnected, (req, res, next) => {
  const user = req.user;

  //  sort the user's favGenres by frequency (high to low)
  // In the end, we could have: counts = { 'pop': 4, 'electro': 8, 'rap': 2 }
  let counts = {};

  let genresToSort = user.favGenres;
  genresToSort.forEach(genre => {
    counts[genre] = (counts[genre] || 0) + 1;
  });

  // In the end, we could have: genresSorted = ['electro','pop','rap']
  let genresSorted = Object.keys(counts).sort((a, b) => {
    return counts[b] - counts[a];
  });

  //  create users' Top Ten Artists/Genres
  const topTenArtists = [];
  const topTenGenres = [];
  for (let i = 0; i < Math.min(11, genresSorted.length); i++) {
    topTenArtists.push(user.favArtists[i]);
    topTenGenres.push(genresSorted[i]);
  }

  // display top 10 artists and top 10 genres
  const topTenGen = topTenGenres.map(item => {
    return item.charAt(0).toUpperCase() + item.slice(1);
  });
  const countryLowercase = countrynames.getName(user.country).toLowerCase();
  const userCountry =
    countryLowercase.charAt(0).toUpperCase() + countryLowercase.slice(1);
  res.render("profile", {
    user,
    // converts countrycode to full country name
    countryName: userCountry,
    topTenArtists,
    topTenGen
  });
});

//ROUTE going to our RESULTS-Page
//TODO: implement matching-function here
//  match favArtist and favGenre arrays against eachother by using the following function:
// function matches(arr){
//   var counts = {};
//   arr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
//   let matchedKeys = Object.keys(counts).filter(key => counts[key] > 1)
//   return matchedKeys
//   }
router.get("/results", isConnected, (req, res, next) => {
  const curId = req.user._id;
  Match.find({
    $or: [{ _user1: curId }, { _user2: curId }]
  })
    .sort({ score: -1 })
    .then(matches => {
      let bestMatches = [];
      console.log("this is matches", matches);
      for (let i = 0; i < 2; i++) {
        if (matches[i]._user1.toString() == curId.toString()) {
          bestMatches.push(matches[i]._user2);
        } else {
          bestMatches.push(matches[i]._user1);
        }
      }
      console.log("Ids of the bestmatches", bestMatches);
      User.find().then(users => {
        let promises = [];
        // Loop on each possible couple (user1,user2) where user1 < user2
        for (let i1 = 0; i1 < users.length; i1++) {
          for (let i2 = i1 + 1; i2 < users.length; i2++) {
            promises.push(Match.updateOrCreate(users[i1], users[i2]));
          }
        }
        return Promise.all(promises);
      });
    })
    .then(() => {
      return Match.find()
        .populate("_user1", "username")
        .populate("_user2", "username");
    })
    .then(matches => {
      console.log("TCL: matches", matches);
      res.render("results", { matches });
    });
});

//ROUTE for a users PROFILE-page
router.get("/profile/:id", isConnected, (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(user => {
      //  sort the user's favGenres by frequency (high to low)
      let counts = {};
      let genresToSort = user.favGenres;
      genresToSort.forEach(x => {
        counts[x] = (counts[x] || 0) + 1;
      });
      let genresSorted = Object.keys(counts).sort((a, b) => {
        return counts[b] - counts[a];
      });

      //  create users Top Ten Artists/Genres
      const topTenArtists = [];
      const topTenGenres = [];
      for (let i = 0; i <= 10; i++) {
        topTenArtists.push(user.favArtists[i]);
        topTenGenres.push(genresSorted[i]);
      }

      // display top 10 genres with uppercase first letter
      const topTenGen = topTenGenres.map(item => {
        return item.charAt(0).toUpperCase() + item.slice(1);
      });
      const countryLowercase = countrynames.getName(user.country).toLowerCase();
      const userCountry =
        countryLowercase.charAt(0).toUpperCase() + countryLowercase.slice(1);
      res.render("profile", {
        user,
        // converts countrycode to full country name
        countryName: userCountry,
        topTenArtists,
        topTenGen
      });

      // const userCountry = user.country

      // const topTenGen = user.favGenres.map((item) => {
      //   return item.charAt(0).toUpperCase() + item.slice(1)
      // })
      // console.log("User--", user);
      // res.render("profile", { user,
      //   topTenGen,
      //   countryName: countrynames.getName(userCountry).toLowerCase(),
      //   });
    })
    .catch(err => console.log("Error getting Userdata--", err));
});

module.exports = router;
