$(function(){
  var data = new FormData();
  var Index = ({
    init:function(){
      this.bindUploadImage()
      this.deleteProd()
      this.addProd()
    },
    bindUploadImage:function(){
      $('input[type="file"]').change(function(){
        var form = $('<form enctype="multipart/form-data"></form>');
        var _this = $(this);
        form.append(_this.clone());
        form.append($('<input type="submit" value="提交"/>'));
        form.append($('input[name="activityName"]').clone())
        form.ajaxSubmit({
          url : '/uploadFile',
          type:'POST',
          dataType:'JSON',
          success:function(ret){
            /*if(ret.code == 1){
              var siblingInput = _this.siblings('input');
              var name = _this.parent().data('type');
              if(siblingInput.length){
                  siblingInput.remove();
              }
              _this.after('<input type="hidden" name="'+name+'" value="'+ret.imgUrl+'"/>')
            }*/

            console.log('ok');
          }
        })
      })
    },

    deleteProd: function(){//添加产品
      $('#deleteProd').on('click',function(){
        var allProds = $('#productArea .product');
        if(allProds.length< 2){
          return 0;
        }
        var lastProd = allProds[allProds.length-1];
        $(lastProd).remove();
      })
    },

    addProd: function(){//删除产品
      $('#addProd').on('click',function(){
        $('#productArea').append(`
          <div class="product"><div class="col-sm-4"><label>产品名称</label><input class="form-control" type="text" name="productName" placeholder="请输入产品名称"></div><div class="col-sm-4"><label>产品价格</label><input class="form-control" type="text" name="productPrice" placeholder="请输入产品价格"></div><div class="col-sm-4" data-type="productImage"><label>产品图片</label><input class="form-control" type="file" name="inputFile"><p>图片地址：</p></div></div>
          `)
      })
    }

  }).init()
});
