var path = require('path');
var express = require('express');
var fetch = require('node-fetch');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Campground = require('./models/campground');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var dbLink = process.env.MONGODB_URI
  || `mongodb://localhost:27017/yelp_camp`;
mongoose.connect(dbLink);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/campgrounds', function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds });
    }
  });
});

app.post('/campgrounds', function(req, res) {
  var { name, image, description } = req.body;
  Campground.create({ name, image, description }, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new');
});

app.get('/campgrounds/:id', function(req, res) {
  var { id } = req.params;
  Campground.findById(id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground });
    }
  });
});

var port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log( 'rocking on port ' + port );
});
