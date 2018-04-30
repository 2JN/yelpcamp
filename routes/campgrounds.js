var express = require('express')
var router = express.Router()

var Campground = require('../models/campground')

router.get('/', function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds', { campgrounds })
    }
  })
})

router.post('/', function (req, res) {
  var { name, image, description } = req.body
  Campground.create({ name, image, description }, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds')
    }
  })
})

router.get('/new', function (req, res) {
  res.render('campgrounds/new')
})

router.get('/:id', function (req, res) {
  var { id } = req.params
  Campground.findById(id).populate('comments').exec(function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/show', { campground })
    }
  })
})

module.exports = router
