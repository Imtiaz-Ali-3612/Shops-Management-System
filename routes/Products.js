var express = require('express');
var router = express.Router();
var shops    =require('../models/shops');
var products = require('../models/products');
var User =require('../models/user');
/* GET home page. */
router.get('/Products',function(req,res){



  products.find({},function(err,prod){
          if(err)
          {
              console.log(err);
          }
          else{

      res.render("viewProducts.ejs",{Products:prod});
          }

      });
});

router.get('/Products/:id',function(req,res){

    products.findById(req.params.id,function(err,prod){
      if(err)
       console.log(err);
       else {

             res.render('details.ejs',{Products:prod});
       }
    });

});
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
router.get('/AddProducts',Authenticate,function(req,res){

  if(req.user.shops.length==0){
    req.flash('success', 'Please Add Shop First');
              res.redirect('/');
  }else{
  res.render('newProduct.ejs');
    }
});
router.post('/AddProducts',Authenticate,function(req,res){

  User.findOne(req.user, function(err, user){
      if(err){
          console.log(err);
          res.redirect("/");
      } else {
              shops.findById(user.shops,function(err,shop){
                if(err)console.log(err);
                products.create(
                  {
                    name:req.body.name,
                    quantity:req.body.quantity,
                    image:req.body.image,
                  	typeOfProduct:req.body.typeOfProduct,
                  	price:req.body.price,
                  	details:req.body.details,
                    shops:req.user.shops[0],
                    shopKeeper:req.user
                  },
                  function(err,prod){
                    if(err)console.log(err);
                    else {
                        if(!Array.isArray(shop.products))
                        {
                          shop.products=[];

                        }
                          shop.products.push(prod);
                          shop.save();
                          req.flash('success','New Product added successfully .');
                          res.redirect('/Products')
                    }
                  });


              });

          }

      });

});

// router.get('/Products/product/:specificProduct',function(req,res){
//     product.findOne({typeOfProduct:req.params.specificProduct},function(err,prod){
//       if(err){
//       console.log('err');
//       console.log(err);
//       console.log('err');
//     }else {
//           res.render('specificProduct.ejs',{product:prod});
//       }
//     });
// });
module.exports = router;
