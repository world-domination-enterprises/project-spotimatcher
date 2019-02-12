const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

//ROUTE going to our PROFILE
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

//ROUTE going to our RESULTS-Page
//TODO: implement matching-function here
router.get("/results", (req, res, next) => {
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
