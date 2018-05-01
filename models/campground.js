var mongoose = require('mongoose')

var CampgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  author: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },

    username: String
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
