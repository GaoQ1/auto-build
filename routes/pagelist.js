const express = require('express');
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');
const rm = require('rimraf');
const path = require('path');
const async = require('async');
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
  async.series([(cb) => {
    Model('Template').find({'_id': req.params.id}).exec(function(err, info){
      let html = `${info[0].modelType}_${info[0]._id}.html`;
      let htmlPath = path.resolve(__dirname, `../dist/html/${html}`);
      fs.stat(htmlPath, (err, stat) => {//删除html
        if(stat && stat.isFile()){
          rm(htmlPath, () => {
            console.log('delete html file ok!');
          })
        }
      })


      info[0].imageInfos.forEach((item,index) => {
        let imagePath = path.resolve(__dirname, `../${item.destination}/${item.originalname}`);

        fs.stat(imagePath, (err, stat) => {//删除images
          if(stat && stat.isFile()){
            rm(imagePath, () => {
              console.log('delete image is done!');
            })
          }
        })

      });

      cb(err, 'delete file')
    })
  },
    (cb) => {
      Model('Template').remove({'_id': req.params.id}).exec(function(err, info){
        if(err){
          req.flash('error',err);
          res.redirect('back');
        }else{
          req.flash('success','删除文章成功');
          res.redirect('/pagelist');
        }

        cb(err, 'delete database')
      })
    }
  ],(err, result) => {
    console.log(result);
  })
});

router.get('/download/:id', auth.checkLogin, function(req,res){
  let fileName = `download_${Date.now()}.zip`;
  let filePath = path.join(process.cwd(), `/download/${fileName}`);//文件打包地址
  let output = fs.createWriteStream(filePath);

  let archive = archiver('zip',{
    store: true
  });
  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);

  Model('Template').find({'_id': req.params.id}).exec(function(err, info){
    if(err){
      req.flash('error',err);
      res.redirect('back');
    }else{
      let html = `${info[0].modelType}_${info[0]._id}.html`;
      let htmlPath = path.resolve(__dirname, `../dist/html/${html}`);
      archive.append(fs.createReadStream(htmlPath), { name: html })

      info[0].imageInfos.forEach((item,index) => {
        let imagePath = path.resolve(__dirname, `../${item.destination}/${item.originalname}`);
        archive.append(fs.createReadStream(imagePath), { name: item.originalname })
      });

      archive.finalize();

      //下载文章
      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        let stats = fs.statSync(filePath);
        if(stats.isFile()){
          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+fileName,
            'Content-Length': stats.size
          });
          fs.createReadStream(filePath).pipe(res);
        }else{
          req.flash('error','下载文章失败');
        }
      });
    }
  })
});

module.exports = router;
