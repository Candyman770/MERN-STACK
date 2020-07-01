var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require('express-session');
const FileStore=require('session-file-store')(session);
const passport=require('passport');
const authenticate=require('./authenticate');
const config=require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var leaderRouter=require('./routes/leaderRouter');
var promoRouter=require('./routes/promoRouter');
var uploadRouter=require('./routes/uploadRouter');
var favoriteRouter=require('./routes/favoriteRouter');
var commentRouter=require('./routes/commentRouter');

const mongoose=require('mongoose');
const url=config.mongoUrl;
const connect=mongoose.connect(url);

connect.then((db)=>{
	console.log('Connected correctly to the server');
},err=>{console.log(err);});

var app = express();

app.all('*',(req,res,next)=>{
	if(req.secure){
		return next();
	}
	else{
		res.redirect(307, 'https://'+req.hostname+':'+app.get('secPort')+req.url);
	}
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-53421'));
/*app.use(session({
	name:'session-id',
	secret:'12345-67890-09876-53421',
	resave:false,
	saveUninitialized:false,
	store:new FileStore()
}));*/

app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*const auth=(req,res,next)=>{
	console.log(req.signedCookies);

	if(!req.signedCookies.user){
		const authHeader=req.headers.authorization;
		if(!authHeader){
			const err=new Error('You are not Authenticated');
			res.setHeader('WWW-Authenticate','Basic');
			err.status=401;
			return next(err);
		}
		const Auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
		const username=Auth[0];
		const password=Auth[1];
		if(username==='admin'&&password==='password'){
			res.cookie('user','admin',{signed:true})
			next();
		}
		else{
			const err=new Error('You are not Authenticated');
			res.setHeader('WWW-Authenticate','Basic');
			err.status=401;
			return next(err);
		}
	}
	else{
		if(req.signedCookies.user==='admin'){
			next();
		}
		else{
			const err=new Error('You are not Authenticated');
			err.status=401;
			return next(err);
		}
	}
	
}*/

/*const auth=(req,res,next)=>{

	if(!req.user){
		const err=new Error('You are not Authenticated');
		err.status=403;
		return next(err);
	}
	else{
		next();
	}
	
};


app.use(auth)*/

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoriteRouter);
app.use('/comments',commentRouter);

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
