var mongoose = require('mongoose');

var CampgroundSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);
