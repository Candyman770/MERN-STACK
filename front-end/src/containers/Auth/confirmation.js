import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from '../../store/actions/index';

const Confirmation=props=>{
	const firstname=localStorage.getItem('firsty');
	console.log('Hi from confirm!')
	if(localStorage.getItem('username')&&localStorage.getItem('password')){
		props.onConfirmation();
	}
	let authRedirect=null;
	if(props.firstname===firstname)
		authRedirect=<Redirect to='/dishes' />
	return (
		<React.Fragment>
			{authRedirect}
			<h3>You will be redirected shortly!</h3>
		</React.Fragment>
	);
};

const mapStateToProps=state=>{
	return{
		firstname:state.auth.firstname
	}
}

const mapDispatchToProps=dispatch=>{
	return{
		onConfirmation:()=>dispatch(actions.confirmation())
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Confirmation);