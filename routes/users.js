const express = require('express');
const router = express.Router();
const auth = require('../middle/auth');

router.get('/reg', auth.checkNotLogin, function(req,res){
  res.render('user/reg');
});

router.post('/reg', auth.checkNotLogin, function(req,res){
  var user = req.body;
  if(user.password != user.repassword){
    req.flash('error','两次输入的密码不一致!');
    return res.redirect('/users/reg');
  }
  delete user.repassword;
  user.password = md5(user.password);

  new Model('User')(req.body).save(function(err,user){
    if(err){
      req.flash('error', '保存数据库出错!');
      return res.redirect('/users/reg');
    }
    req.flash('success', '恭喜你注册成功!');
    req.session.user = user;
    res.redirect('/');
  })
});


router.get('/login', auth.checkNotLogin, function(req, res) {
  res.render('user/login')
});

router.post('/login', auth.checkNotLogin, function(req,res){
  var user = req.body;
  user.password = md5(user.password);

  Model('User').findOne(user).exec(function(err,user){
    if(err){
      req.flash('error','登录失败!');
      return res.redirect('/users/login');
    }
    if(user){
      req.session.user = user;
      req.flash('success','登录成功!');
      res.redirect('/');
    }else{
      req.flash('error','用户或密码不正确');
      res.redirect('/users/login');
    }
  })
});

router.get('/logout', auth.checkLogin, function(req,res){
  req.session.user = null;
  return res.redirect('/users/login');
});

module.exports = router;
