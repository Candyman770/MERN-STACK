import axios from '../../axios';
import * as actionTypes from './actionTypes';

export const logout=()=>{
	localStorage.removeItem('token');
	localStorage.removeItem('expDate');
	localStorage.removeItem('userId');
	localStorage.removeItem('firstname');
	return {
		type:actionTypes.AUTH_LOGOUT
	}
};

export const checkAuthTimeout=(expTime)=>{
	return dispatch=>{
		setTimeout(()=>{
			dispatch(logout());
		},expTime*1000)
	}
};

export const authStart=()=>{
	return {
		type:actionTypes.AUTH_START
	}
};

export const authSuccess=(token,userId,firstname)=>{
	return {
		type:actionTypes.AUTH_SUCCESS,
		token:token,
		userId:userId,
		firstname:firstname
	}
};

export const authFail=(error)=>{
	return {
		type:actionTypes.AUTH_FAIL,
		err:error
	}
};

export const login=(data)=>{
	return dispatch=>{
		dispatch(authStart());
		const headers={
			'Content-Type':'application/json'
		}
		axios.post('/users/login',data,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			const expDate=new Date(new Date().getTime()+res.data.expiresIn*1000);
			localStorage.setItem('token',res.data.token);
			localStorage.setItem('expDate',expDate);
			localStorage.setItem('userId',res.data.userId);
			localStorage.setItem('firstname',res.data.firstname);
			dispatch(authSuccess(res.data.token,res.data.userId,res.data.firstname));
			removeCredentials();
			dispatch(checkAuthTimeout(res.data.expiresIn));
			if(res.data.err){
				dispatch(authFail(res.data.err));
			}
		})
	}
};

const setCredentials=(body)=>{
	localStorage.setItem('username',body.username);
	localStorage.setItem('password',body.password);
	localStorage.setItem('firsty',body.firstname);
}

const removeCredentials=()=>{
	localStorage.removeItem('username');
	localStorage.removeItem('password');
	localStorage.removeItem('firsty');
}

export const confirmation=()=>{
	console.log('Hi!');
	const body={};
	body['username']=localStorage.getItem('username');
	body['password']=localStorage.getItem('password');
	if(body['username']&&body['password']){
		return dispatch=>{
			dispatch(login(body));
		}
	}
}

export const register=(data)=>{
	return dispatch=>{
		dispatch(authStart());
		const headers={
			'Content-Type':'application/json'
		}
		const body={};
		body['username']=data['username'];
		body['password']=data['password'];
		body['firstname']=data['firstname'];
		axios.post('/users/signup',data,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			///dispatch(login(body));
			if(res.data.err){
				dispatch(authFail(res.data.err));
			}
			else{
				setCredentials(body);
			}
		})
	}
};

export const checkAuthState=()=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		if(!token){
			dispatch(logout());
		}
		else{
			const expDate=new Date(localStorage.getItem('expDate'));
			if(expDate>new Date()){
				const userId=localStorage.getItem('userId');
				const firstname=localStorage.getItem('firstname');
				dispatch(authSuccess(token,userId,firstname));
				dispatch(checkAuthTimeout((expDate.getTime()-new Date().getTime())/1000));
			}
			else{
				dispatch(logout());
			}
		}
	}
}

