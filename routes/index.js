const express = require('express');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const auth = require('../middle/auth');
const router = express.Router();

//处理文件上传的中间件，只解析类型是multiple/form-data的类型
const multer = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `dist/images`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})
let upload = multer({ storage: storage });
let imgFiles = [];

router.get('/', auth.checkLogin, function(req,res){
  res.render('index', {})
})

router.get('/edit/:id', auth.checkLogin, function(req,res){
  let id = req.params.id;

  Model('Template').find({_id: id}).exec(function(err,info){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      let options = {//渲染模板所需要的数据
        activity: info[0].activity,
        productInfos: info[0].products
      }
      res.render('index', options);
    }
  })
})

router.get('/submit/:id', auth.checkLogin, function(req, res) {
  var id = req.params.id;
  Model('Template').find({_id: id}).exec(function(err,info){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }else{
      let model = info[0].modelType;//模板类型
      let id = info[0]._id;//数据的ID

      let options = {//渲染模板所需要的数据
        activity: info[0].activity,
        productInfos: info[0].products
      }

      res.render(`template/${model}.pug`,options);

      let compiledFunction = pug.compileFile(path.join(__dirname,`../views/template/${model}.pug`));

      let html = compiledFunction(options);
      fs.writeFile(path.join(__dirname,`../dist/html/${model}_${id}.html`),html,(err)=>{
        if(err){
          console.log(err);
        }
        console.log('build success!');
      });
    }
  })
});

router.post('/submit/:id?', function(req, res) {
  let userId = req.session.user._id;
  let activityId = req.params.id;

  if(!!activityId){
    Model('Template').update({_id: activityId}, {$set:Object.assign(req.body,{userId: userId})}, function(err,info){
      if(err){
        console.log(err)
        res.json({
          code:0
        })
      }else{
        res.json({
          code:1,
          id : activityId
        })
      }
    })
  }else{
    new Model('Template')(Object.assign(req.body,{userId: userId})).save(function(err,info){
      if(err){
        console.log(err)
        res.json({
          code:0
        })
      }else{
        res.json({
          code:1,
          id : info._id
        })
      }
    })
  }
});


router.post('/uploadFile', upload.array('inputFile'), function(req, res) {
  let inputFile = req.files[0];
  res.json({
    code:1,
    imgUrl : inputFile.path,
    imgName: inputFile.filename
  })

});

module.exports = router;
