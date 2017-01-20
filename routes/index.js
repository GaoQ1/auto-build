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
    cb(null, 'dist/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
  }
})
let upload = multer({ storage: storage });
let imgFiles = [];


router.get('/', auth.checkLogin, function(req,res){
  res.render('index')
})

router.get('/submit/:id', function(req, res) {
  var id = req.params.id;
  Model('Template').find({_id: id}).exec(function(err,info){
    if(err){
      console.log("err:",err)
    }else{
      let model = info[0].modelType;//模板类型
      let id = info[0]._id;//数据的ID
      let productInfos = [];

      info[0].productName.split(',').forEach((val, index) => {
        productInfos.push({
          'imgFiles': imgFiles.slice(1)[index],
          'productName': val,
          'productPrice': info[0].productPrice.split(',')[index]
        })
      })


      let options = {//渲染模板所需要的数据
        activityName: info[0].activityName,
        pageTitle: info[0].pageTitle,
        backgroundImage: imgFiles[0],
        productInfos: productInfos
      }

      res.render('template/model1.pug',options);

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


router.post('/submit', upload.array('inputFile'), function(req, res) {
  imgFiles = req.files;

  new Model('Template')(req.body).save(function(err,info){
    if(err){
      console.log(err)
    }else{
      let id = info._id;
      res.redirect('/submit/' + id);
    }
  })
});

module.exports = router;
