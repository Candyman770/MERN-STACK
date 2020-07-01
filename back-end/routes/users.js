var express = require('express');
var router = express.Router();
var nodemailer=require('nodemailer');
const bodyParser=require('body-parser');
const User=require('../models/users');
const passport=require('passport');
const authenticate=require('../authenticate');
const cors =require('./cors');

const transporter=nodemailer.createTransport({
	service:'Gmail',
	auth:{
		user:'isaac2606.msit@gmail.com',
		pass:'@Terikuiu12'
	}
})


router.use(bodyParser.json());


router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStatus=200});
/* GET users listing. */
router.route('/')
.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	User.find({})
	.then(users=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(users);
	},err=>next(err))
	.catch(err=>next(err));
})

router.post('/signup',cors.corsWithOptions,(req,res,next)=>{
	if(!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){
		const err=new Error('Invalid Password!');
		err.status=403;
		return next(err);
	}
	if(!req.body.username.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
		err=new Error('Invalid Email!');
		err.status=403;
		return next(err);
	}
	User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
		if(err){
			res.statusCode=500;
			res.setHeader('Content-Type','application/json');
			res.json({err:err});
		}
		else{
			if(req.body.firstname)
				user.firstname=req.body.firstname;
			if(req.body.lastname)
				user.lastname=req.body.lastname;
			if(req.body.facebookId)
				user.facebookId=req.body.facebookId;
			user.save((err,user)=>{
				if(err){
					res.statusCode=500;
					res.setHeader('Content-Type','application/json');
					res.json({err:err});
					return ;
				}
				passport.authenticate('local')(req,res,()=>{
					res.statusCode=200;
					res.setHeader('Content-Type','application/json');
					res.json({success:true, status:'Registration Successful!'});
					const token=authenticate.getToken({_id:req.user._id});
					const url=`https://localhost:3443/users/confirmation/${token}`;
					transporter.sendMail({
						to:req.body.username,
						subject:'Confirm Email',
						html:`Please click the link to confirm your email :<a href="${url}">${url}</a>`
					})
				});
			});
		}
	})

});

router.get('/confirmation/:token',cors.cors,(req,res,next)=>{
	const decode=authenticate.jwtVerify(req.params.token);
	User.findOneAndUpdate(decode._id,{confirmed:true},{new:true})
	.then(user=>{
		if(user!==null){
			//res.end('Email confirmed!');
			//res.statusCode=200;
			res.redirect(307,'http://localhost:5000/confirmation');
		}
	},err=>next(err))
	.catch(err=>next(err))

})

router.post('/login',cors.corsWithOptions,(req,res,next)=>{
	console.log(req.body);
	User.findOne({username:req.body.username})
	.then(user=>{
		if(!user){
			if(!user.confirmed){
				const error=new Error('Please confirm your email!');
				error.status=403;
				next(error);
			}
		}
	})
	passport.authenticate('local',(err,user,info)=>{
		if(err){
			return next(err);
		}
		if(!user){
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json({success:false, status:'Login Unsuccessful!',err:info});
			return ;
		}
		req.logIn(user,(err)=>{
			if(err){
				res.statusCode=401;
				res.setHeader('Content-Type','application/json');
				res.json({success:false, status:'Login Unsuccessful!',err:'Could not login user!'});
				return ;
			}
		
			const token=authenticate.getToken({_id:req.user._id});
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json({success:true, token:token, status:'You are successfully logged in!',expiresIn:3600,
				userId:req.user._id,firstname:req.user.firstname});

		})
	})(req,res,next);
	
})

router.get('/logout',cors.corsWithOptions,(req,res,next)=>{
	if(req.session){
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else{
		const err=new Error('You are not logged in!');
		err.status=403;
		next(err);
	}
});

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
	if(req.user){
		const token=authenticate.getToken({_id:req.user._id});
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json({success:true, token:token, status:'You are successfully logged in!'});
	}
})

router.get('/checkJWTToken',cors.corsWithOptions,(req,res,next)=>{
	passport.authenticate('jwt',{session:false},(err,user,info)=>{
		if(err)
			return next(err);
		if(!user){
			res.statusCode=401;
			res.setHeader('Content-Type','application/json');
			res.json({status:'JWT invalid!',success:false,err:info});
		}
		else{
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json({status:'JWT valid!',success:true,user:user});
		}
	})(req,res,next);
})

/*VERY VERY IMPORTANT*/

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = router;
