var express = require('express');
var product =require('../models/products');
var User = require('../models/user');
var cart=require('../models/cart');
var router = express.Router();
var methoOveride=require('method-override');

//-----------------------------
//ADDing Items TO Users Cart
//----------------------------

router.get("/cart/:id/newItem",ensureAuthenticated, function(req, res){
    // find campground by id
    product.findById(req.params.id,function(err,prod){
      if(err)console.log(err);
      console.log(prod);
    res.render('AddToCart',{product:prod});
    });

});

router.post("/cart/:id/newItem",ensureAuthenticated, function(req, res){
   //lookup campground using ID
     console.log(req.body.Qnty);
   if(req.body.Qnty==0)
   {


                req.flash('success', 'Quantity must be One or above . ');
               res.redirect('/users/cart/'+req.params.id+'/newItem');

   }else{
   User.findOne(req.user, function(err, user){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
              product.findOne({_id:req.params.id},function(err,prod){
                if(err)console.log(err);
                else {
                  // Here
                  if(req.body.Qnty>prod.quantity)
                  {
                    req.flash('success','Quantity must be below product Quantity .');
                    return res.redirect('/users/cart/'+req.params.id+'/newItem');
                  }
                  console.log(prod);
                  cart.create({
                    products:prod,
                    Qnty     :req.body.Qnty,
                    Price    :prod.price,

                    shopKeeper:prod.shopKeeper,
                    Image    :prod.image,
                    Name     :prod.name,

                  }
                    , function(err, Cart){
                     if(err){
                         console.log(err);
                     } else {
                       if (!Array.isArray(user.cart)) {
                                   user.cart = [];
                         }
                         user.cart.push(Cart);
                         user.save();
                         res.redirect('/users/cart');
                     }
                  });

                  //TOHERE
                }
              });


           }

       });
      }
   });
   function calcTotal(user)
   {
     var totalPrice=0;
     user.cart.forEach(function(it){
       console.log(it.Qnty+"  "+it.Price);
       if(it.Qnty!=undefined)
       {
         if(it.Price!=undefined)
         {

           totalPrice+=it.Qnty*it.Price;
         }
       }
     });
     return totalPrice;
   }

router.get('/cart',ensureAuthenticated,function(req,res){
  //  var tempCart=new Array();
  console.log("in cart");
    User.findOne(req.user).populate("cart").exec(function(err,user){
          if(err)
          console.log(err);
          else {
                    var totalPrice=calcTotal(user);

                    console.log(totalPrice);
                    res.render('cart',{cart:[user,totalPrice]});
              }
            });
          //    res.render('cart',{cart:tempCart});

    });

router.put('/cart/:id/update',function(req,res){
    console.log("Put called");
    cart.findById(req.params.id,function(err,prod){
      if(err)console.log(err);
      else {

              product.findById(prod.products,function(err,found){
                  if(err)console.log(err);
                  else {
                        console.log(found.quantity);
                    if(found.quantity<(req.body.qnty)){
                
                      req.flash('success','Quantity is Above Product Quantity');
                      return res.redirect('/users/cart');
                    }
                    else {

                            cart.findByIdAndUpdate(req.params.id,{Qnty:req.body.qnty},function(err,updated){
                              if(err) console.log(err);
                              else {

                                  res.redirect('/users/cart');
                              }
                            });
                    }
                  }
              });
      }
    });

});
router.delete('/cart/:id/delete',function(req,res){
    cart.findByIdAndRemove(req.params.id,function(err,del){
      if (err) {
          console.log(err);
      }
      else {
        res.redirect('/users/cart');
      }
    });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}











module.exports = router;
