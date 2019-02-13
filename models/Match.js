const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  _user1: {type: Schema.Types.ObjectId, ref: 'User'},
  _user2: {type: Schema.Types.ObjectId, ref: 'User'},
  score: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

matchSchema.statics.calculateScore = function(user1, user2) {
  return Math.floor(Math.random() * 100);
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
      match.score = Match.calculateScore(user1, user2);
    }
    // Otherwise we create a new match between user1 and user2
    else {
      match = new Match({
        _user1: user1._id,
        _user2: user2._id,
        score: Match.calculateScore(user1, user2)
      });
    }
    return match.save();
  });
}

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;