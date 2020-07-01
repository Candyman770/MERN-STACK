const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const cors=require('./cors');

const Dishes=require('../models/dishes');
const Comments=require('../models/comments');
const dishRouter=express.Router();

dishRouter.use(bodyParser.json());

const ITEMS_PER_PAGE=4;

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	const page = +req.query.page || 1;
	const price= +req.query.price //|| 10000;
	const category=req.query.category //|| 'All';
	const label=req.query.label //|| 'None';
	const query={};
	if(category!==undefined && category!=='All')
		query['category']=category;
	if(label!==undefined && label!=='None')
		query['label']=label;
	if(!isNaN(price) && price!==0)
		query['price']={$lte:price}
	//console.log(price)
	/*if(category==='All')
		category='.*?';
	if(label==='None')
		label='.*?';*/
	//const labelRegex=new RegExp("^("+label+")$");
	//const categoryRegex=new RegExp("^("+category+")$");
	//console.log(page);
	let totalItems;
	Dishes.find(query)
	/*.where({'price':{$lte:price}})
	.where({'category':{$regex:categoryRegex}})
	.where({'label':{$regex:labelRegex}})*/
	.countDocuments()
	.then(numProducts=>{
		totalItems=numProducts;
		return Dishes.find(query)
			/*.where({'price':{$lte:price}})
			.where({'category':{$regex:categoryRegex}})
			.where({'label':{$regex:labelRegex}})*/
			.skip((page-1)*ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE)
	})
	.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json({dishes:[...dishes],pagination:{
			hasNextPage:ITEMS_PER_PAGE*page < totalItems,
			lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
			currentPage:page
		}});
	},err=>next(err))
	.catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.create(req.body)
	.then(dish=>{
		console.log('Dish created ',dish);
		Comments.create({dish:dish._id});
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},err=>next(err))
	.catch(err=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supproted on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.deleteMany({})
	.then((resp)=>{
		Comments.deleteMany({});
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},err=>next(err))
	.catch(err=>next(err));
});

dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},err=>next(err))
	.catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode=403;
	res.end('POST operation not suppported on /dishes/'+req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.dishId,{
		$set:req.body
	},{
		new:true
	})
	.then((dish)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},err=>next(err))
	.catch(err=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((resp)=>{
		Comments.deleteOne({dish:req.params.dishId});
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},err=>next(err))
	.catch(err=>next(err));
});

/*dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish)=>{
		if(dish!=null){
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish.comments);
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null){
			req.body.author=req.user._id
			dish.comments.push(req.body);
			dish.save()
			.then(dish=>{
				Dishes.findById(dish._id)
					.populate('comments.author')
					.then(dish=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(dish.comments);
					})
			},err=>next(err));
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supproted on /dishes/'+req.params.dishId+'/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish!=null){
			for(var i =(dish.comments.length-1);i>=0;i--){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then(dish=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(dish.comments);
			},err=>next(err));
		}
		else{
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish)=>{
		if(dish!=null&&dish.comments.id(req.params.commentId)!=null){
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish.comments.id(req.params.commentId));
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('POST operation not suppported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish!=null&&dish.comments.id(req.params.commentId)!=null){
			if(dish.comments.id(req.params.commentId).author.equals(req.user._id)){
				if(req.body.rating){
					dish.comments.id(req.params.commentId).rating=req.body.rating;
				}
				if(req.body.comment){
					dish.comments.id(req.params.commentId).comment=req.body.comment;
				}
				dish.save()
				.then(dish=>{
					Dishes.findById(dish._id)
					.populate('comments.author')
					.then(dish=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(dish.comments.id(req.params.commentId));
					})
				},err=>next(err));
			}
			else{
				const err=new Error('You are not authorized to perform this operation!');
				err.status=403;
				return next(err);
			}
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish!=null&&dish.comments.id(req.params.commentId)){
			if(dish.comments.id(req.params.commentId).author.equals(req.user._id)){
				dish.comments.id(req.params.commentId).remove();
				dish.save()
				.then(dish=>{
					Dishes.findById(dish._id)
					.populate('comments.author')
					.then(dish=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(dish.comments.id(req.params.commentId));
					})
				},err=>next(err));
			}
			else{
				const err=new Error('You are not authorized to perform this operation!');
				err.status=403;
				return next(err);
			}
		}
		else if(dish==null){
			err=new Error('Dish '+req.params.dishId+' not found');
			err.status=404;
			return next(err);
		}
		else{
			err=new Error('Comment '+req.params.commentId+' not found');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
*/
dishRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports=dishRouter;