import axios from '../../axios';
import * as actionTypes from './actionTypes';

export const fetchStart=()=>{
	return{
		type:actionTypes.FETCH_START
	}
}

export const fetchSuccess=(data,pagination)=>{
	return {
		type:actionTypes.FETCH_SUCCESS,
		dishes:data,
		pagination:pagination
	}
}

export const fetchFail=(error)=>{
	return {
		type:actionTypes.FETCH_FAIL,
		err:error
	}
}

export const fetch=(query)=>{
	return dispatch=>{
		dispatch(fetchStart());
		axios.get(`/dishes${query}`)
		.then(res=>{
			console.log(res);
			dispatch(fetchSuccess(res.data.dishes,res.data.pagination));
			
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchFail(err));
		})
	}
};
