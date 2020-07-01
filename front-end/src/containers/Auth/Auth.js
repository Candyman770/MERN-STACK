import React,{useState} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import classes from './Auth.module.css';
import Input from '../../components/UI/input/input';
import Button from '../../components/UI/button/button';

const Auth=props=>{
	//console.log(window.history);
	const [login,setlogin]=useState({
		username:{
			elementType:'input',
			elementConfig:{
				type:'text',
				placeholder:'Username'
			},
			value:''
		},
		password:{
			elementType:'input',
			elementConfig:{
				type:'password',
				placeholder:'Password'
			},
			value:''
		}
	});
	const [register,setRegister]=useState({
		username:{
			elementType:'input',
			elementConfig:{
				type:'text',
				placeholder:'Your Username'
			},
			value:''
		},
		password:{
			elementType:'input',
			elementConfig:{
				type:'password',
				placeholder:'Minimum 7 Characters'
			},
			value:''
		},
		firstname:{
			elementType:'input',
			elementConfig:{
				type:'text',
				placeholder:'Your First Name'
			},
			value:''
		},
		lastname:{
			elementType:'input',
			elementConfig:{
				type:'text',
				placeholder:'Your Last Name'
			},
			value:''
		}
	})
	const [isSignup,setIsSignup]=useState(false);

	const loginHandler=(event)=>{
		event.preventDefault();

		setIsSignup(false);
	}
	const registerHandler=(event,id)=>{
		event.preventDefault();

		setIsSignup(true);
		//registerClasses.push(classes.Active);

	}
	const inputLoginHandler=(event,id)=>{
		const updatedControls={
			...login,
			[id]:{
				...login[id],
				value:event.target.value
			}
		}
		setlogin(updatedControls);
	}
	const inputRegisterHandler=(event,id)=>{
		const updatedControls={
			...register,
			[id]:{
				...register[id],
				value:event.target.value
			}
		}
		setRegister(updatedControls);
	}
	const submitHandler=(event)=>{
		event.preventDefault();
		const data={};
		if(!isSignup){
			for(let key in login){
				data[key]=login[key].value;
			}
			props.onLogin(data);
		}
		else{
			for(let key in register){
				data[key]=register[key].value;
			}
			props.onRegister(data);
		}
	}

	let loginElementsArray=[];
	for(let key in login){
		loginElementsArray.push({
			id:key,
			config:login[key]
		})
	};
	let formLogin=loginElementsArray.map(loginElement=>{
		return <Input
			key={loginElement.id}
			elementType={loginElement.config.elementType}
			elementConfig={loginElement.config.elementConfig}
			value={loginElement.config.value}
			label={loginElement.id}
			changed={(event)=>inputLoginHandler(event,loginElement.id)} />
	})
	let registerElementsArray=[];
	for(let key in register){
		registerElementsArray.push({
			id:key,
			config:register[key]
		})
	};
	let formRegister=registerElementsArray.map(registerElement=>{
		return <Input
			key={registerElement.id}
			elementType={registerElement.config.elementType}
			elementConfig={registerElement.config.elementConfig}
			value={registerElement.config.value}
			label={registerElement.id}
			changed={(event)=>inputRegisterHandler(event,registerElement.id)} />
	})
	return (
		<div className={classes.Auth}>
			<form onSubmit={submitHandler}>
				<a href='#' className={!isSignup?classes.Active:classes.Deactive} 
					onClick={loginHandler}>Login</a>
				<a href='#' className={isSignup?classes.Active:classes.Deactive} 
					onClick={registerHandler}>Register</a>
				{isSignup?formRegister:formLogin}
				<Button>SUBMIT</Button>
			</form>
		</div>
	);
};

const mapDispatchToProps=dispatch=>{
	return {
		onRegister:(data)=>dispatch(actions.register(data)),
		onLogin:(data)=>dispatch(actions.login(data))
	}
}

export default connect(null,mapDispatchToProps)(Auth);