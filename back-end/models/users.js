const mongoose=require('mongoose');
const schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const user=new schema({
	firstname:{
		type:String,
		default:''
	},
	lastname:{
		type:String,
		default:''
	},
	facebookId:{
		type:String
	},
	confirmed:{
		type:Boolean,
		default:false
	},
	admin:{
		type:Boolean,
		default:false
	}
});

user.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',user);
