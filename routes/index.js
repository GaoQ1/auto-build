var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
  res.render('index')
})

router.get('/submit', function(req, res) {
  Model('Template').find({_id: '585cfefd18265f3130c53d22'}).exec(function(err,info){
    if(err){
      console.log(err)
    }else{
      console.log(info);

      res.render('model',{
        title: info[0].title,
        container: info[0].container
      });
    }
  })



});

router.post('/submit', function(req, res) {
  new Model('Template')(req.body).save(function(err,item){
    if(err){
      console.log(err)
    }else{
      res.redirect('/submit');
    }
  })
});

module.exports = router;
