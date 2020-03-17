var express = require('express');
var router = express.Router();


var product = require('../models/products');

/* GET home page. */
router.get('/',function(req, res, next) {
    if(req.query.search)
    {
      const regex=new RegExp(escapeRegex(req.query.search),'gi');
      if(req.query.submit)
      {
        product.find({typeOfProduct:regex, price:{ "$lt":req.body.to }},function(err,prod){
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render("index.ejs",{Products:prod});

              }
            });

        }
              else {
                product.find({$or:[{typeOfProduct:regex},{name:regex},{details:regex}]},function(err,prod){
                        if(err)
                        {
                            console.log(err);
                        }
                        else{
                            res.render("index.ejs",{Products:prod});

                      }
                    });

              }


              }
          else{
            if(req.body.from >0 && req.body.to >= req.body.from)
            {
                product.find({ "price":{"$lt":req.body.to} },function(err,prod){
                        if(err)
                        {
                            console.log(err);
                        }
                        else{
                    res.render("index.ejs",{Products:prod});
                        }

                        });
            }
            else {

                  product.find({ },function(err,prod){
                          if(err)
                          {
                              console.log(err);
                          }
                          else{
                      res.render("index.ejs",{Products:prod});
                          }

                          });
            }
    }
});


router.get('/home',function(req,res){
  res.render('home.ejs')
});
// router.get('/cartItem',ensureAuthenticated,function(req,res){
//   res.redirect('/users/cart')
// });

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}
function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};

module.exports = router;
