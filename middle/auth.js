exports.checkLogin = function(req,res,next){
  if(!req.session.user){
    req.flash('error','未登录');
    return res.redirect('/users/login');
  }
  next();
}

exports.checkNotLogin = function(req,res,next){
  if(req.session.user){
    req.flash('success','已登录');
    return res.redirect('back');
  }
  next();
}
