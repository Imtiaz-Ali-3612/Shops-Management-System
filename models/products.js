var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// User Schema
var ProductSchema = mongoose.Schema({
	name: {
		type: String

	},
  quantity:{
      type:Number
  },
  image:{
    type:String
  },
	typeOfProduct:{
		type:String
	},
	price:{
		type:Number
	},
	details:{
		type:String
	},
	deliveryService:{
	type:String,
	default:'not available'
	},
	shopKeeper:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	shops:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'shops'
	}

});

var Product = module.exports = mongoose.model('products', ProductSchema);
module.exports.createProduct = function(newProduct, callback){
	 			newProduct.save(callback);

}
