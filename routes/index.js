const express = require('express');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const router = express.Router();

//处理文件上传的中间件，只解析类型是multiple/form-data的类型
const multer = require('multer');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})
let upload = multer({ storage: storage });

router.get('/', function(req,res){
  res.render('index')
})

router.get('/submit/:id', function(req, res) {
  var id = req.params.id;
  Model('Template').find({_id: id}).exec(function(err,info){
    if(err){
      console.log(err)
    }else{
      let model = info[0].modelType;//模板类型
      let id = info[0]._id;//数据的ID

      res.render('template/model1.pug',{
        title: info[0].title,
        content: info[0].content
      });

      let compiledFunction = pug.compileFile(path.join(__dirname,`../views/template/${model}.pug`));

      let html = compiledFunction({
        title: info[0].title,
        content: info[0].content
      });
      fs.writeFile(path.join(__dirname,`../dist/${model}_${id}.html`),html,(err)=>{
        if(err){
          console.log(err);
        }
        console.log('build success!');
      });
    }
  })
});

router.post('/submit', function(req, res) {
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
