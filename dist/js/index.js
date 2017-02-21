$(function(){
  var data = new FormData();
  var Index = ({
    init:function(){
      this.bindUploadImage()
      this.deleteProd()
      this.addProd()
      this.bindSubmit()
    },
    bindUploadImage:function(){
      $('body').on('change', 'input[type="file"]', function(){
        var form = $('<form enctype="multipart/form-data"></form>');
        var _this = $(this);

        form.append(_this.clone());
        form.ajaxSubmit({
          url : '/uploadFile',
          type:'POST',
          dataType:'JSON',
          success:function(res){
            if(res.code == 1){
              var siblingInput = _this.siblings('input');
              var name = _this.parent().parent().data('type');

              if(siblingInput.length){
                siblingInput.remove();
              }
              _this.after('<input type="hidden" name="'+name+'" data-name="'+ res.imgName +'" value="'+ res.imgUrl+'"/>')

              _this.closest('.input-container').find('.input-file').html('<img src="../images/'+res.imgName+'"></img>')
            }

          }
        })
      })
    },

    bindSubmit: function(){
      $('#submitBtn').on('click', function(){
        //活动区域
        var activityName = $('#activityArea').find('input[name="activityName"]').val();
        var pageTitle = $('#activityArea').find('input[name="pageTitle"]').val();
        var backgroundImagePath = $('#activityArea').find('input[name="backgroundImage"]').val();
        var backgroundImage = $('#activityArea').find('input[name="backgroundImage"]').data('name');

        //产品区域
        var products = [];
        [].slice.call($('#productArea .product')).forEach(function(val,item){
          products.push(
            {
              'productName': $(val).find('input[name="productName"]').val(),
              'productPrice': $(val).find('input[name="productPrice"]').val(),
              'productImagePath': $(val).find('input[name="productImage"]').val(),
              'productImageName': $(val).find('input[name="productImage"]').data('name')
            }
          )
        })

        //模板
        var modelType = $('select[name="modelType"]').find('[selected="selected"]').val();

        var params = {
          'activity': {
            'activityName': activityName,
            'pageTitle': pageTitle,
            'backgroundImagePath': backgroundImagePath,
            'backgroundImageName': backgroundImage
          },
          'products': products,
          'modelType': modelType
        }

        var submitUrl = null;
        if(location.pathname === '/'){
          submitUrl = '/submit'
        }else{
          submitUrl = '/submit' + location.pathname.split('edit')[1]
        }

        $.ajax({
          type: "post",
          url: submitUrl,
          data: params,
          dataType: "json",
          success: function (data) {
            if(data.code === 1){
              location.href = '/submit/' + data.id
            }
          }
        });
      })
    },

    deleteProd: function(){//添加产品
      $('.container').on('click', '.deleteProd', function(){
        var thisProd = $(this).closest('.product');
        $(thisProd).remove();
      })
    },

    addProd: function(){//删除产品
      $('#addProd').on('click',function(){
        $('#productArea').append(`
          <div class="product"><div class="col-sm-4"><label>产品名称</label><div class="input-container"><input class="form-control" type="text" name="productName" placeholder="请输入产品名称"></div></div><div class="col-sm-4"><label>产品价格</label><div class="input-container"><input class="form-control" type="text" name="productPrice" placeholder="请输入产品价格"></div></div><div class="col-sm-3 input-img" data-type="productImage"><label>产品图片</label><div class="input-container"><input class="form-control" type="file" name="inputFile"><div class="input-file">+</div></div></div><div class="col-sm-1"><button class="btn btn-danger deleteProd" type="button" style="float:right">删除</button></div></div>
          `)
      })
    }

  }).init()
});
