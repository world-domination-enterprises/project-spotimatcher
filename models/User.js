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
  favGenres: [],
  matches: []
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Now this is what you can do with a document: myUser.firstLetter
userSchema.virtual('firstLetter').get(function() {
  return this.username.substr(0,1)
})



const User = mongoose.model('User', userSchema);
module.exports = User;
