import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchFavoriteStart=()=>{
	return {
		type:actionTypes.FETCH_FAVORITE_START
	}
};

export const fetchFavoriteSuccess=(data)=>{
	return {
		type:actionTypes.FETCH_FAVORITE_SUCCESS,
		data:data
	}
};

export const fetchFavoriteFail=(err)=>{
	return {
		type:actionTypes.FETCH_FAVORITE_FAIL,
		err:err
	}
};

export const fetchFavorites=()=>{
	return dispatch=>{
		dispatch(fetchFavoriteStart);
		const token=localStorage.getItem('token');
		const headers={
			'Authorization':`bearer ${token}`
		}
		axios.get('/favorites',{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(fetchFavoriteSuccess(res.data.dishes));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchFavoriteFail(err));
		})
	}
}

export const deleteFav=(id)=>{
	return {
		type:actionTypes.DELETE_FAV,
		id:id
	}
}

export const deleteFavorites=()=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Authorization':`bearer ${token}`
		}
		axios.delete('favorites',{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(deleteFav('ALL'));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchFavoriteFail(err));
		})
	}
}

export const deleteFavorite=(id)=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Authorization':`bearer ${token}`
		}
		axios.delete(`favorites/${id}`,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(deleteFav(id))
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchFavoriteFail(err));
		})
	}
}

export const addFav=(data)=>{
	return {
		type:actionTypes.ADD_FAV,
		data:data
	}
}

export const addFavorite=(id)=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Authorization':`bearer ${token}`
		}
		const data={};
		axios.post(`favorites/${id}`,data,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(addFav(res.data.dishes));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchFavoriteFail(err));
		})
	}
}