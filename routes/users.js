const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('./helpers/auth')
//Users index
router.get('/', auth.requireLogin, (req, res, next) => {
  User.find({}, 'username', function(err, users) {
    if(err) {
      console.error(err);
    } else {
      res.render('users/index', { users: users });
    }
  });
});

// Users new
router.get('/new', (req, res, next) => {
  res.render('users/new');
})

// Users create
router.post('/', (req, res, next) => {
  const user = new User(req.body);
  User.find({}, 'username', function(err, users) {
    for(let i = 0; i < users.length; i++)
    {
      if(users[i].username == user.username)
      {
        return res.redirect('users/new');
      }
    }
    user.save(function(err, user) {
      if(err) console.log(err);
      return res.redirect('/users');
    })
  })
});

module.exports = router;