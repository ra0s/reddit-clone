const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const User = require('../models/user');
const comments = require('./comments');

router.get('/new', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, function(err, room) {
      if(err) { console.error(err) };
  
      res.render('posts/new', { room });
    });
});
  
router.post('/', auth.requireLogin, (req, res, next) => {
    console.log(req.params.roomId);
    Room.findById(req.params.roomId, function(err, room, user) {
      if(err) { console.error(err) };
      console.log(user);
      let post = new Post(req.body);
      post.room = room;
      post.user = user;
      post.save(function(err, post) {
        if(err) { console.error(err) };
  
        return res.redirect(`/rooms/${req.params.roomId}`);
      });
    });
});

router.post('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    post.points += parseInt(req.body.points);

    post.save(function(err, post) {
      if(err) { console.error(err) };

      return res.redirect(`/rooms/${post.room}`);
    });
  });
});
router.use('/:postId/comments', comments)
module.exports = router;