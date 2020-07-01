const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');
const cors=require('./cors');

const Comments=require('../models/comments');
const Dishes=require('../models/dishes');

const commentRouter=express.Router();

commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus=200})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Comments.deleteMany({})
	.then((resp)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	},err=>next(err))
	.catch(err=>next(err));
})


commentRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null){
			Comments.findOne({dish:req.params.dishId})
			.then((commentContainer)=>{
				if(commentContainer!==null){
					Comments.findById(commentContainer._id)
					.populate('comments.author').populate('dish')
					.then(commentContainer=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(commentContainer);
					})
				}
				else{
					res.statusCode=200;
					res.setHeader('Content-Type','text/plain');
					res.end('No Comments to show');
				}
			},err=>next(err))
			.catch(err=>next(err));
		}
		else{
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null)
			Comments.findOne({dish:req.params.dishId})
			.then(commentContainer=>{
				if(commentContainer!=null){
					req.body.author=req.user._id;
					commentContainer.comments.push(req.body)
					commentContainer.save()
					.then(commentContainer=>{
						Comments.findById(commentContainer._id)
						.populate('comments.author').populate('dish')
						.then(commentContainer=>{
							res.statusCode=200;
							res.setHeader('Content-Type','application/json');
							res.json(commentContainer);
						})

					},err=>next(err))
				}
				else{
					commentContainer=new Comments({dish:req.params.dishId});
					req.body.author=req.user._id;
					commentContainer.comments.push(req.body);
					commentContainer.save()
					.then(commentContainer=>{
						Comments.findById(commentContainer._id)
						.populate('comments.author')
						.then(commentContainer=>{
							res.statusCode=200;
							res.setHeader('Content-Type','application/json');
							res.json(commentContainer);
						})
					},err=>next(err))
				}
			},err=>next(err))
			.catch(err=>next(err));
		else{
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	})
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supproted on /comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null){
			return Comments.deleteOne({dish:req.params.dishId})
		}
		else {
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	})
	.then(resp=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(resp);
	})
});

commentRouter.route('/:dishId/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
	res.sendStatus=200;
})
.get(cors.cors,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null)
			Comments.findOne({dish:req.params.dishId})
			.then((commentContainer)=>{
				if(commentContainer!=null&&commentContainer.comments.id(req.params.commentId)!=null){
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json(commentContainer.comments.id(req.params.commentId));
				}
				else if(commentContainer==null){
					var err=new Error(`There are no comments for dishId ${req.params.dishId}`);
					err.status=403;
					return next(err);
				}
				else{
					err=new Error(`Comment with id ${req.params.commentId} not found`);
					err.status=404;
					return next(err);
				}
			},err=>next(err))
			.catch(err=>next(err));
		else{
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end(`POST operation not suppported on /comments/${dishId}/${commentId}`);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null)
			return Comments.findOne({dish:req.params.dishId})
		else{
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.then((commentContainer)=>{
		if(commentContainer!=null&&commentContainer.comments.id(req.params.commentId)!=null){
			if(commentContainer.comments.id(req.params.commentId).author.equals(req.user._id)){
				if(req.body.comment)
					commentContainer.comments.id(req.params.commentId).comment=req.body.comment;
				if(req.body.rating)
					commentContainer.comments.id(req.params.commentId).rating=req.body.rating;
				commentContainer.save()
				.then(commentContainer=>{
					Comments.findById(commentContainer._id)
					.populate('comments.author')
					.then(commentContainer=>{
						res.statusCode=200;
						res.setHeader('Content-Type','application/json');
						res.json(commentContainer.comments.id(req.params.commentId));
					})
				},err=>next(err));
			}
			else{
				const err=new Error('You are not authorized to perform this operation!');
				err.status=403;
				return next(err);
			}
		}
		else if(commentContainer==null){
			const err=new Error(`There are no comments for dishId ${req.params.dishId}`);
			err.status=403;
			return next(err);
		}
		else{
			err=new Error(`Comment with id ${req.params.commentId} not found`);
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then(dish=>{
		if(dish!=null)
			return Comments.findOne({dish:req.params.dishId})
		else{
			const err=new Error('Dish with id '+req.params.dishId+' not Found!');
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.then((commentContainer)=>{
		if(commentContainer!=null&&commentContainer.comments.id(req.params.commentId)!=null){
			if(commentContainer.comments.id(req.params.commentId).author.equals(req.user._id)){
				commentContainer.comments.id(req.params.commentId).remove();
				commentContainer.save()
				.then(commentContainer=>{
					Comments.findById(commentContainer._id)
					.populate('comments.author')
					.then(commentContainer=>{
						res.statusCode=200;
						res.setHeader('Content-Type','text/plain');
						res.end('Comment Deleted!');
					})
				},err=>next(err));
			}
			else{
				const err=new Error('You are not authorized to perform this operation!');
				err.status=403;
				return next(err);
			}
		}
		else if(commentContainer==null){
			const err=new Error(`There are no comments for dishId ${req.params.dishId}`);
			err.status=403;
			return next(err);
		}
		else{
			err=new Error(`Comment with id ${req.params.commentId} not found`);
			err.status=404;
			return next(err);
		}
	},err=>next(err))
	.catch(err=>next(err));
})

commentRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports=commentRouter;