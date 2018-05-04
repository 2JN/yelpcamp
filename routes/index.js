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
      console.log(err)
      return res.render('register')
    }

    passport.authenticate('local')(req, res, function () {
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
  res.redirect('/campgrounds')
})

module.exports = router
