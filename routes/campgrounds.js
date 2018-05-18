var express = require('express')
var NodeGeocoder = require('node-geocoder')
var { isLoggedIn, checkCampgroundOwnership } = require('../middleware')

var router = express.Router()

var Campground = require('../models/campground')

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}

var geocoder = NodeGeocoder(options)

router.get('/', function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds', { campgrounds, page: 'campgrounds' })
    }
  })
})

router.post('/', isLoggedIn, function (req, res) {
  var { name, price, image, description } = req.body
  var author = { id: req.user._id, username: req.user.username }

  geocoder.geocode(req.body.location, function (err, data) {
    if (err || data.legnth) {
      req.flash('error', 'Invalid address')
      return res.reditect('back')
    }

    var lat = data[0].latitude
    var lng = data[0].longitude
    var location = data[0].formattedAddress

    Campground.create(
      { name, price, image, description, author, lat, lng, location },

      function (err, campground) {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/campgrounds')
        }
      }
    )
  })
})

router.get('/new', isLoggedIn, function (req, res) {
  res.render('campgrounds/new')
})

router.get('/:id', function (req, res) {
  var { id } = req.params
  Campground.findById(id).populate('comments').exec(function (err, campground) {
    if (err || !campground) {
      req.flash('error', 'Campground not found')
      res.redirect('back')
    } else {
      res.render('campgrounds/show', { campground })
    }
  })
})

router.get('/:id/edit', checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err || !campground) {
      req.flash('error', 'Campground not found')
      res.redirect('/campgrounds')
    } else {
      res.render('campgrounds/edit', { campground })
    }
  })
})

router.put('/:id', checkCampgroundOwnership, function (req, res) {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address')
      return res.redirect('back')
    }

    req.body.campground.lat = data[0].latitude
    req.body.campground.lng = data[0].longitude
    req.body.campground.location = data[0].formattedAddress

    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      function (err, campground) {
        if (err) {
          res.redirect('/campgrounds')
        } else {
          res.redirect('/campgrounds/' + req.params.id)
        }
      }
    )
  })
})

router.delete('/:id', checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.reditect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router
