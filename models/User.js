const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  spotifyID: String,
  refreshToken: String,
  email: String,
  country: String,
  profileUrl: String,
  photoUrl: String,
  favArtists: [],
  favGenres: []
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
