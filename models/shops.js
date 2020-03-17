var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// User Schema
var ShopSchema = mongoose.Schema({
	name: {
		type: String
	},
  Address:{
      type:String
  },
  image:{
    type:String
  },
	products: [
					 {
							type: mongoose.Schema.Types.ObjectId,
							ref: "products"
					 }
		],
		owner:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		}

});

var Shop = module.exports = mongoose.model('shops', ShopSchema);
module.exports.createUser = function(newProd, callback){
	 			newProd.save(callback);

}
