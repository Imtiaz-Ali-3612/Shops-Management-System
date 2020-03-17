var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// User Schema
var cartSchema = mongoose.Schema({

        shop:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"shops"
        },
      	products:
      					 {
      							type: mongoose.Schema.Types.ObjectId,
      							ref: "products"
      					 }
      		,
        shopKeeper:
    			       {
      							type: mongoose.Schema.Types.ObjectId,
      							ref: "User"
      					 }
      		,
        Qnty:Number,
        Price:Number,
        Name:String,
        Image:String,

    		owner:{
    			type:mongoose.Schema.Types.ObjectId,
    			ref:"User"
    		},



});

var Cart = module.exports = mongoose.model('cart', cartSchema);
module.exports.createUser = function(newProd, callback){
	 			newProd.save(callback);

}
