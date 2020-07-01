const mongoose=require('mongoose');
const schema=mongoose.Schema;

const commentingSchema=new schema({
	rating:{
		type:Number,
		min:1,
		max:5,
		required:true
	},
	comment:{
		type:String,
		required:true
	},
	author:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User'
	}
},{
	timestamps:true
})

const commentingsSchema=new schema({
	comments:[commentingSchema],
	dish:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Dish'
	}
},{
	timestamps:true
});

const comments=mongoose.model('Commenting',commentingsSchema);

module.exports=comments;