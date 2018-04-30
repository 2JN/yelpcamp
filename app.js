var path = require('path')
var express = require('express')
var fetch = require('node-fetch')
var mongoose = require('mongoose')
var passport = require('passport')
var bodyParser = require('body-parser')
var LocalStrategy = require('passport-local')

var campgroundRoutes = require('./routes/campgrounds')
var commentRoutes = require('./routes/comments')
var indexRoutes = require('./routes/index')

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

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)
app.use(indexRoutes)

var port = process.env.PORT || '3000'

app.listen(port, () => {
  console.log('rocking on port ' + port)
})
