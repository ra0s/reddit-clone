const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// Comments new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };

      res.render('comments/new', { post, room });
    });
  })
});

router.post('/', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, function(err, room) {
      if(err) { console.error(err) };
  
      Post.findById(req.params.postId, function(err, post) {
        if(err) { console.error(err) };
  
        let comment = new Comment(req.body);
        console.log(post);
        post.comments.push(comment);
  
        post.save(function(err, post) {
          if(err) { console.error(err) };
  
          comment.save(function(err, comment) {
            if(err) { console.error(err) };
  
            return res.redirect(`/rooms/${room._id}`);
           });
         });
      });
   });
});
  
module.exports = router;