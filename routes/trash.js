// GARBAGE BIN FOR DISCARDED CODE SNIPPETS -- FOR REFERENCE PURPOSES OR REUSE

//  TEST-route for matching algorithm *** !!REFACTORED AND IMPROVED VERSION!! ***
router.get("/mongotest", (req, res, next) => {
  User.find()
    .then(users => {
      let promises = [];
      // Loop on each possible couple (user1,user2) where user1 < user2
      for (let i1 = 0; i1 < users.length; i1++) {
        for (let i2 = i1 + 1; i2 < users.length; i2++) {
          promises.push(Match.updateOrCreate(users[i1], users[i2]));
        }
      }
      return Promise.all(promises);
    })
    .then(() => {
      return Match.find()
        .populate("_user1", "username")
        .populate("_user2", "username");
    })
    .then(matches => {
      console.log("TCL: matches", matches);
      res.render("mongotest", { matches });
    });
});

//  TEST-route for matching algorithm *** !!OLD VERSION!! ***
router.get("/mongotest", (req, res, next) => {
  const allUserIds = [];
  User.find().then(users => {
    for (let user of users) {
      allUserIds.push(user._id);
    }

    const pairedUsers = pairwise(allUserIds);

    // //  Petter
    // var myList = user.favGenres

    // User.find({favGenres: {$in: myList}}, function(err, user){
    //   console.log(user)
    // });

    //  Felix

    let promises = [];
    for (let i = 0; i < pairedUsers.length; i++) {
      User.find({
        _id: {
          $in: pairedUsers[i]
        }
      })
        //  this seems to be the problem => causing some kind of delay?; how can we solve this? => two separate loops?
        .then(users => {
          const mergedArtistArray = [
            ...users[0].favArtists,
            ...users[1].favArtists
          ];
          const artistArrayMatches = matches(mergedArtistArray);
          const score = artistArrayMatches.length;
          console.log("TCL: mergedArtistArray", artistArrayMatches);
          console.log("TCL: score", score);

          Match.find({
            _user1: {
              $in: pairedUsers[i]
            },
            _user2: {
              $in: pairedUsers[i]
            }
          }).then(match => {
            console.log("TCL: duplicate match", match);
            const id = match[0]._id;
            console.log("TCL: id", id);
            Match.findById({ _id: id }).then(matchFound => {
              console.log("TCL: matchFound", matchFound);
              return;
            });
          });

          //  TEST

          promises.push(
            Match.create({
              _user1: pairedUsers[i][0],
              _user2: pairedUsers[i][1],
              score: score
            })
          );
        });
    }

    Promise.all(promises);
    // .then(() => {
    setTimeout(() => {
      // TEST

      // TEST

      Match.find()
        .populate("_user1", "username")
        .populate("_user2", "username")
        .then(matches => {
          console.log("TCL: matches", matches);
          res.render("mongotest", { matches });
        });
    }, 500);

    //  FINE
  });
});

function pairwise(list) {
  var pairs = new Array((list.length * (list.length - 1)) / 2),
    pos = 0;

  for (var i = 0; i < list.length; i++) {
    for (var j = i + 1; j < list.length; j++) {
      pairs[pos++] = [list[i], list[j]];
    }
  }
  return pairs;
}

function matches(arr) {
  var counts = {};
  arr.forEach(function(x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  let matchedKeys = Object.keys(counts).filter(key => counts[key] > 1);
  return matchedKeys;
}
