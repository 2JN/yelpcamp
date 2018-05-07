var express = require('express')
var passport = require('passport')

var User = require('../models/user')

var router = express.Router()

router.get('/', function (req, res) {
  res.render('campgrounds/index')
})

router.get('/register', function (req, res) {
  res.render('register')
})

router.post('/register', function (req, res) {
  var { username, password } = req.body
  User.register(new User({ username }), password, function (err, user) {
    if (err) {
      req.flash('error', err.message)
      return res.render('register')
    }

    passport.authenticate('local')(req, res, function () {
      req.flash('success', `Welcome to YelpCamp ${user.username}`)
      res.redirect('/campgrounds')
    })
  })
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post(
  '/login',

  passport.authenticate('local', {
    successRedirect: '/campgrounds', failureRedirect: '/login'
  }),

  function (req, res) {
    // something happens later
  }
)

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('success', 'Logged you out')
  res.redirect('/campgrounds')
})

module.exports = router
