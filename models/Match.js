const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const User = require("../models/User");

const matchSchema = new Schema({
  _user1: {type: Schema.Types.ObjectId, ref: 'User'},
  _user2: {type: Schema.Types.ObjectId, ref: 'User'},
  score: Number,
  matchingArtists: [],
  matchingGenres: []
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

matchSchema.statics.findMatchingArtists = function(user1, user2) {
  const mergedArtistArray = [
    ...user1.favArtists,
    ...user2.favArtists
  ]

  function matches(arr) {
    var counts = {};
    arr.forEach(function(x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    let matchedKeys = Object.keys(counts).filter(key => counts[key] > 1);
    return matchedKeys;
  }

  const matchingArtists = matches(mergedArtistArray)
  return matchingArtists
}

matchSchema.statics.findMatchingGenres = function(user1, user2) {
  function countGenres(user) {
  let countedGenresObject = {};
  let genresToCount = user.favGenres;
  genresToCount.forEach(x => {
    countedGenresObject[x] = (countedGenresObject[x] || 0) + 1;
  });
  return countedGenresObject
  }

  function sortGenres(countedGenresObject) {
    let genresSorted = Object.keys(countedGenresObject).sort((a, b) => {
      return countedGenresObject[b] - countedGenresObject[a];
    })
    return genresSorted
  }

  function matches(arr) {
    var counts = {};
    arr.forEach(function(x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    let matchedKeys = Object.keys(counts).filter(key => counts[key] > 1);
    return matchedKeys;
  }

  let countedGenresUser1 = countGenres(user1)
  let countedGenresUser2 = countGenres(user2)

  let genresSortedUser1 = sortGenres(countedGenresUser1)
  let genresSortedUser2 = sortGenres(countedGenresUser2)

  const mergedSortedGenresArray = [...genresSortedUser1, ...genresSortedUser2]
  const matchingGenres = matches(mergedSortedGenresArray)

  return matchingGenres
}


matchSchema.statics.calculateScore = function(user1, user2) {
  matchingArtists = Match.findMatchingArtists(user1, user2)
  matchingGenres = Match.findMatchingGenres(user1, user2)
  const score = (matchingArtists.length * 3) + matchingGenres.length
  return score
}

// Now, this is what you can do with your model: Match.updateOrCreateMatch()
matchSchema.statics.updateOrCreate = function(user1, user2) {
  let Match = this.model('Match')
  return Match.findOne({
    $or: [
      { _user1: user1._id, _user2: user2._id },
      { _user1: user2._id, _user2: user1._id }
    ]
  }).then(match => {
    // If we have found a match between user1 and user2, we update it
    if (match) {
      // match.score = Match.calculateScore(user1, user2);
      match.matchingArtists = Match.findMatchingArtists(user1, user2)
      match.matchingGenres = Match.findMatchingGenres(user1, user2)
      match.score = Match.calculateScore(user1, user2)
    }
    // Otherwise we create a new match between user1 and user2
    else {
      match = new Match({
        _user1: user1._id,
        _user2: user2._id,
        score: Match.calculateScore(user1, user2),
        matchingArtists: Match.findMatchingArtists(user1, user2),
        matchingGenres: Match.findMatchingGenres(user1, user2)
      });
      // score = matchData.score
      // artistMatches = matchData.artistMatches
      // match.score = score
      // match.artistMatches = artistMatches
    }
    return match.save();
    }).then(match => {
      let promises = []
      promises.push(User.findByIdAndUpdate(user1._id, {$push : { matches: match._id } }, { new: true} ), 
      User.findByIdAndUpdate(user2._id, {$push : { matches: match._id } }, { new: true} ))
      return Promise.all(promises)
    })
  }

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;