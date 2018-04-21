var mongoose = require('mongoose')

var CampgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }]
})

module.exports = mongoose.model('Campground', CampgroundSchema)
