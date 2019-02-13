const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const matchSchema = new Schema({
  user1_id: {type: Schema.Types.ObjectId, ref: 'User'},
  user2_id: {type: Schema.Types.ObjectId, ref: 'User'},
  score: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;