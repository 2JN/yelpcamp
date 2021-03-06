var express = require('express')
var router = express.Router({ mergeParams: true })

var Campground = require('../models/campground')
var Comment = require('../models/comment')

var { isLoggedIn, checkCommentOwnership } = require('../middleware')

router.get('/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', { campground })
    }
  })
})

router.post('/', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash('error', 'Something went wrong')
        } else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save()

          campground.comments.push(comment)
          campground.save()

          req.flash('success', 'Successfully added comment')
          res.redirect(`/campgrounds/${req.params.id}`)
        }
      })
    }
  })
})

router.get('/:comment_id/edit', checkCommentOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err || campground) {
      req.flash('error', 'No campground found')
      res.redirect('back')
    } else {
      Comment.findById(req.params.comment_id, function (err, comment) {
        if (err || comment) {
          req.flash('error', 'No comment found')
          res.redirect('back')
        } else {
          res.render('comments/edit', { campground, comment })
        }
      })
    }
  })
})

router.put('/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    function (err, comment) {
      if (err) {
        res.redirect('back')
      } else {
        res.redirect(`/campgrounds/${req.params.id}`)
      }
    }
  )
})

router.delete('/:comment_id', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect('back')
    } else {
      req.flash('success', 'Comment deleted')
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

module.exports = router
