const pug = require('pug');
const fs = require('fs');
const path = require('path');
const config = require('./page.config');
const compiledFunction = pug.compileFile('./model/index.pug');
const html = compiledFunction(config);
fs.writeFile(path.join(__dirname,'../dist/index.html'),html,(err)=>{
  if(err){
    console.log(err);
  }
  console.log('build success!');
});