const express = require('express');
const router = express.Router();
const auth = require('../middle/auth');

router.get('/', auth.checkLogin, function(req,res){
  Model('Template').find({'userId': req.session.user._id}).exec(function(err, info){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      let options = {
        pagelists: info
      }
      res.render('pagelist', options);
    }
  })
});

router.get('/delete/:id', auth.checkLogin, function(req,res){
  Model('Template').remove({'_id': req.params.id}).exec(function(err, info){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      req.flash('success','删除文章成功');
      res.redirect('/pagelist');
    }
  })
});

module.exports = router;
