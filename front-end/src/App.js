import React,{useEffect,useRef} from 'react';
import {connect} from 'react-redux';
import {withRouter,Route} from 'react-router-dom';

import * as actions from './store/actions/index';

import classes from './App.module.css';
import Layout from './containers/Layout/Layout';
import Dishes from './containers/Dishes/Dishes';
import Auth from './containers/Auth/Auth';
import Confirmation from './containers/Auth/confirmation';
import DishComments from './containers/DishComments/DishComments';
import Favorites from './containers/Favorites/Favorites';
import AuthContext from './context/authenticate';

const App=(props)=> {
	const scrollBtn=useRef(null);
	const {onTryAutoLogin}=props;
	onTryAutoLogin();
	const scrollFunction=()=>{
		if(document.body.scrollTop>60 || document.documentElement.scrollTop>60){
			scrollBtn.current.style.display='block'
		}
		else{
			scrollBtn.current.style.display='none';
		}
	}
	window.onscroll=()=>{
		scrollFunction();
	}
	const topFunction=()=>{
		document.body.scrollTop=0;
		document.documentElement.scrollTop=0;
	}
	return (
		<AuthContext.Provider value={{
			isAuthenticated:props.isAuthenticated,
			user:props.firstname
		}}>
		<Layout >
			<Route path='/dishes' exact render={(props)=><Dishes {...props} />} />
			<Route path='/dishes/comments/:dishid' render={props=><DishComments {...props} />} />
			<Route path='/auth' render={props=><Auth {...props} />} />
			<Route path='/favorites' render={props=><Favorites {...props} />} />
			<Route path='/confirmation' component={Confirmation} />
		</Layout>
		<button ref={scrollBtn} className={classes.Top} onClick={topFunction}>
			<i className="fa fa-chevron-circle-up" aria-hidden="true"></i>
		</button>
		</AuthContext.Provider>
    );
}

const mapStateToProps=state=>{
	return{
		isAuthenticated:state.auth.token!==null,
		firstname:state.auth.firstname
	}
}

const mapDispatchToProps=dispatch=>{
	return{
		onTryAutoLogin:()=>dispatch(actions.checkAuthState())
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
