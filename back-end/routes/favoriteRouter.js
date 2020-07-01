/*const express=require('express');
const bodyParser=require('body-parser');
const authenticate=require('../authenticate');
const mongoose=require('mongoose');
const cors=require('./cors');

const Favorites=require('../models/favorites');

const favoriteRouter=express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user:req.user._id})
	.populate('user')
	.populate('dishes')
	.then(favorite=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	},err=>next(err))
	.catch(err=>next(err));
})
.post(authenticate.verifyUser,(req,user,next)=>{
	Favorites.findOne({user:req.user._id})
	.then(favorite=>{
		if(favorite!==null){
			req.body.forEach(dish=>{
				if(favorite.dishes.indexOf(dish._id)===-1)
					favorite.dishes.push(dish._id);
			})
			favorite.save()
			.then(favorite=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(favorite);
			},err=>next(err))
		}
		else{
			Favorites.create({'user':req.user._id,'dishes':req.body})
			.then(favorite=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(favorite);
			},err=>next(err))
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supported on /favorites');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Favorites.deleteOne({user:req.user._id})
	.then(favorite=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(favorite);
	},err=>next(err))
	.catch(err=>next(err))
})

favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('GET operation not supported on /favorites/'+req.params.dishId);
})
.post(authenticate.verifyUser,(req,user,next)=>{
	Favorites.findOne({user:req.user._id})
	.then(favorite=>{
		if(favorite!==null){
			if(favorite.dishes.indexOf(req.params.dishId)===-1)
				favorite.dishes.push(req.params.dishId);
			favorite.save()
			.then(favorite=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(favorite);
			},err=>next(err))
		}
		else{
			Favorites.create({'user':req.user._id,'dishes':[req.params.dishId]})
			.then(favorite=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(favorite);
			},err=>next(err));
		}
	},err=>next(err))
	.catch(err=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=403;
	res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Favorites.findOne({user:req.user._id})
	.then(favorite=>{
		if(favorite!==null){
			const index=favorite.dishes.indexOf(req.params.dishId);
			if(index!==-1)
				favorite.dishes.splice(index,1);
			favorite.save()
			.then(favorite=>{
				res.statusCode=200;
				res.setHeader('Content-Type','application/json');
				res.json(favorite);
			},err=>next(err))
		}
	},err=>next(err))
	.catch(err=>next(err))
});

module.exports=favoriteRouter;*/

const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorites = require('../models/favorites');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .exec((err, favorite) => {
                if (err) return next(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .exec((err, favorite) => {
                if (err) { return next(err); }
                if (!favorite) {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            for (var i = 0; i < req.body.length; i++) {
                                if (favorite.dishes.indexOf(req.body[i]._id) < 0) {
                                    favorite.dishes.push(req.body[i]);
                                }
                            }
                            favorite.save()
                                .then((favorite) => {
                                	Favorites.findById(favorite._id)
                                	.populate('user').populate('dishes')
                                	.then(favorite=>{
                                		res.statusCode = 200;
	                                    res.setHeader('Content-Type', 'application/json');
	                                    res.json(favorite);
                                	})
                                }, (err) => next(err))
                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    for (var i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id) < 0) {
                            favorite.dishes.push(req.body[i]);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user').populate('dishes')
                               	.then(favorite=>{
                               		res.statusCode = 200;
	                                res.setHeader('Content-Type', 'application/json');
	                                res.json(favorite);
                               	})
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .exec((err, favorite) => {
                if (err) { return next(err); }

                if (!favorite) {
                    Favorites.create({ user: req.user._id })
                        .then((favorite) => {
                            favorite.dishes.push(req.params.dishId);
                            favorite.save()
                                .then((favorite) => {
                                    Favorites.findById(favorite._id)
                                	.populate('user').populate('dishes')
                                	.then(favorite=>{
                                		res.statusCode = 200;
	                                    res.setHeader('Content-Type', 'application/json');
	                                    res.json(favorite);
                                	})
                                }, (err) => next(err))
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                        favorite.dishes.push(req.params.dishId);
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                	.populate('user').populate('dishes')
                                	.then(favorite=>{
                                		res.statusCode = 200;
	                                    res.setHeader('Content-Type', 'application/json');
	                                    res.json(favorite);
                                	})
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else {
                        const err=new Error('Dish already in favorite list!');
                        err.status=403;
                        return next(err);
                    }
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .exec((err, favorite) => {
                if (err) return next(err);
                if (favorite) {
                    var index = favorite.dishes.indexOf(req.params.dishId);
                    if (index >= 0) {
                        favorite.dishes.splice(index, 1);
                        favorite.save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                	.populate('user').populate('dishes')
                                	.then(favorite=>{
                                		res.statusCode = 200;
	                                    res.setHeader('Content-Type', 'application/json');
	                                    res.json(favorite);
                                	})
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Dish ' + req.params.dishId + ' not found')
                    }
                }
                else {
                    err.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Favorite List not found')
                }

            })
    })

favoriteRouter.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



module.exports = favoriteRouter;