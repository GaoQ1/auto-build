const express = require('express');
const router = express.Router();
const fs = require('fs');
const archiver = require('archiver');
const rm = require('rimraf');
const path = require('path');
const async = require('async');
const auth = require('../middle/auth');

const pageSize = 3;


router.get('/:page?', auth.checkLogin, function(req,res){
  let _page = req.params.page ? req.params.page: 1;
  Model('Template').paginate({'userId': req.session.user._id,'status': 1}, { page: _page, limit: pageSize }, function(err, result) {
    console.log(result);
      if(err){
        req.flash('error',err);
        return res.redirect('back');
      }else{
        res.render('pagelist', result);
      }
  });
});

// 修改删除逻辑，拓展原来的表结构， 0为默认状态，删除就是将默认 status为0的状态修改为1
router.get('/delete/:id', auth.checkLogin, function(req,res){
    Model('Template').update(
      {
        '_id': req.params.id
      },
      {
        'status': 0
      }, function(error) {
        if (error) {
          req.flash('error',error);
          res.redirect('back');
        }else{
          console.log("删除成功")
          req.flash('success','删除成功');
          res.redirect('/pagelist');
        }
    });
  /*
  Model('Template').find({'_id': req.params.id}).exec(function(err, info){
    if(err){
      req.flash('error',err);
      res.redirect('back');
    }else{
      req.flash('success','删除文章成功');
      res.redirect('/pagelist');
    }
    // cb(err, 'delete database')
  });
  */
  // 此处为删除对应 的html  need to delete
    /*
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


      //删除背景图
      let backgourndimagePath = path.resolve(__dirname, `../${info[0].activity.backgroundImagePath}`);

      fs.stat(backgourndimagePath, (err, stat) => {
        if(stat && stat.isFile()){
          rm(backgourndimagePath, () => {
            console.log('delete backgourndImage is done!');
          })
        }
      })

      //删除产品图

      info[0].products.forEach((item,index) => {
        let imagePath = path.resolve(__dirname, `../${item.productImagePath}`);

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
    */
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

      archive.append(fs.createReadStream(htmlPath), { name: html });

      //下载背景图
      let backgroundimagePath = path.resolve(__dirname, `../${info[0].activity.backgroundImagePath}`);
      archive.append(fs.createReadStream(backgroundimagePath), { name: info[0].activity.backgroundImageName })

      info[0].products.forEach((item,index) => {
        let imagePath = path.resolve(__dirname, `../${item.productImagePath}`);
        archive.append(fs.createReadStream(imagePath), { name: item.productImageName })
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
