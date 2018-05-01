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

router.post('/', isLoggedIn, function (req, res) {
  var { name, image, description } = req.body
  var author = { id: req.user._id, username: req.user.username }

  Campground.create(
    { name, image, description, author },

    function (err, campground) {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/campgrounds')
      }
    }
  )
})

router.get('/new', isLoggedIn, function (req, res) {
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

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

module.exports = router
