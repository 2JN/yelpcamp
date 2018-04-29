var path = require('path')
var express = require('express')
var fetch = require('node-fetch')
var mongoose = require('mongoose')
var passport = require('passport')
var bodyParser = require('body-parser')
var LocalStrategy = require('passport-local')

var Campground = require('./models/campground')
var Comment = require('./models/comment')
var User = require('./models/user')

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var dbLink = process.env.MONGODB_URI ||
  `mongodb://localhost:27017/yelp_camp`
mongoose.connect(dbLink)

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(require('express-session')({
  secret: 'anything that you want',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

app.get('/', function (req, res) {
  res.render('campgrounds/index')
})

app.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds', { campgrounds })
    }
  })
})

app.post('/campgrounds', function (req, res) {
  var { name, image, description } = req.body
  Campground.create({ name, image, description }, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds')
    }
  })
})

app.get('/campgrounds/new', function (req, res) {
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', function (req, res) {
  var { id } = req.params
  Campground.findById(id).populate('comments').exec(function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/show', { campground })
    }
  })
})

app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', { campground })
    }
  })
})

app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          campground.comments.push(comment)
          campground.save()

          res.redirect(`/campgrounds/${req.params.id}`)
        }
      })
    }
  })
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.post('/register', function (req, res) {
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

app.get('/login', function (req, res) {
  res.render('login')
})

app.post(
  '/login',

  passport.authenticate('local', {
    successRedirect: '/campgrounds', failureRedirect: '/login'
  }),

  function (req, res) {
    // something happens later
  }
)

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/campgrounds')
})

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

var port = process.env.PORT || '3000'

app.listen(port, () => {
  console.log('rocking on port ' + port)
})
