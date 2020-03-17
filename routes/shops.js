var express = require('express');
var router = express.Router();
var User  =require('../models/user')
var shops = require('../models/shops');
var products=require('../models/products');
/* GET home page. */
function Authenticate(req,res,next)
{
  if(req.isAuthenticated && req.user.isShopkeeper=="Shopkeeper")
  {
    return next();
  }
  else {
    res.render('/');
  }

}
router.get('/AddShop',Authenticate,function(req,res){
       res.render('newShop');
});

router.post("/addShop",Authenticate, function(req, res){
   //lookup campground using ID
   User.findOne(req.user, function(err, user){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {

                     shops.create(
                      {
                       name:req.body.name,
                       Address     :req.body.address,
                       image   :req.body.image,
                       owner:req.user
                     }
                       , function(err, Shop){
                        if(err){
                            console.log(err);
                        } else {
                          if (!Array.isArray(user.shops) ) {
                                      user.shops = [];
                            }
                            user.shops.push(Shop);
                            user.save(function(err,user){console.log(user);});
                            res.redirect('/shops');
                        }
                     });

           }

       });
   });
router.get('/shops',function(req,res){

  // for (i=0;i<5;i++){
  //   var newShop= new shop({
  //     name:'ABC karyana store ',
  //     address:'gulshan e hadeed phase 1',
  //     image:'https://gloimg.gbtcdn.com/gb/pdm-product-pic/Electronic/2016/08/20/goods-img/1502613005531106949.JPG'
  //   });
  //   newShop.save(function(err,prod){
  //     if(err)
  //     console.log("err");
  //     else {
  //       console.log(prod);
  //     }
  //   }
  // );
  // }
  if(req.query.search){
    const regex=new RegExp(escapeRegex(req.query.search),'gi');

  shops.find({Address:regex},function(err,shop){
          if(err)
          {
              console.log(err);
          }
          else{
              res.render("viewShops.ejs",{shops:shop});

        }
      });
    }else{
  shops.find({},function(err,shop){
          if(err)
          {
              console.log(err);
          }
          else{
      res.render("viewShops.ejs",{shops:shop});
          }

      });
  }
});


router.get('/shops/:id',function(req,res){

    shops.findById(req.params.id,function(err,shop){
      if(err)
       console.log(err);
       else {

             res.render('shopDetails.ejs',{shops:shop});
       }
    });

});

router.get('/shops/details/:id',function(req,res){
    shops.findById(req.params.id).populate('products').exec(function(err,shop){
      if(err)console.log(err);
      else {

        res.render('shopProducts',{shops:shop});
      }
    });
});

router.get('/ViewProducts',function(req,res){
  User.findOne(req.user).populate('shops').exec(function(err,shop){
    if(err)console.log(err);
    else {
        if(shop.shops.length==0)
      {
          console.log("this is CALLLED");
            console.log(shop.shops);
            req.flash('success', 'Dont have any Product Yet');
            res.redirect('/');

      }
     else{
       console.log(shop.shops.length);
         shops.findById(shop.shops[0]._id).populate('products').exec(function(err,prod){
           if(err)console.log(err);
           else {
             console.log(prod);

             res.render('ProductsOfShop',{shops:prod});

           }
         });
     }
    }
  });

});

router.delete('/shops/:id/deleteProduct',function(req,res){
  products.findByIdAndRemove(req.params.id,function(err){
    if(err) res.redirect('/');
    else {
      res.redirect('/ViewProducts');
    }
  });
});
router.get('/updateProductForm/:id',function(req,res){
  products.findById(req.params.id,function(err,prod){
    if(err)
    console.log(err);
    else {

      res.render('updateProductForm',{Product:prod});
    }
  });
});
router.put('/shops/:id/updateProduct',function(req,res){
  products.findByIdAndUpdate(req.params.id,
    {
      name:req.body.name,
      quantity:req.body.quantity,
      image:req.body.image,
      typeOfProduct:req.body.typeOfProduct,
      price:req.body.price,
      details:req.body.details
    }

    ,function(err,shop){
    if(err)console.log(err);
    else {
      res.redirect('/ViewProducts')
    }

  });

});



router.get('/getshops',function(req,res){
  console.log("getshops/ "+req.address);
  shops.find({Address:/req.address/},function(err,shop){
          if(err)
          {
              console.log(err);
          }
          else{
              res.render("viewShops.ejs",{shops:shop});

        }
      });

});
router.get('/deliveryService/:id',function(req,res){
      res.render('deliveryForm',{id:req.params.id});

});
router.post('/shop/deliveryService/:id/:qury',function(req,res){
      if(req.params.qury=='available'){
        products.findByIdAndUpdate(req.params.id,{deliveryService:'available'},function(err,prod){
            if(err)console.log(err);
            else {
              req.flash('success','delivery Added to this product');
              res.redirect('/viewProducts');
            }
        });
      }
      else {
        products.findByIdAndUpdate(req.params.id,{deliveryService:'not available'},function(err,prod){
            if(err)console.log(err);
            else {
              req.flash('success','delivery Removed to this product');
              res.redirect('/viewProducts');
            }
        });
      }
});
router.post('/deliveryService/:id',function(req,res){

  products.findById(req.params.id,function(err,prod){
      if(err)console.log(err);
      else {
        User.findByIdAndUpdate(prod.shopKeeper,{$push:{notification:"you have new delivery ordered ! "}},function(err,person){
          if(err)console.log(err);
          else {
                  res.redirect('/');
          }
        });
      }
  });

});
router.get('/notifications',function(req,res){

      res.render('deliveryService');
});
function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};
module.exports = router;
