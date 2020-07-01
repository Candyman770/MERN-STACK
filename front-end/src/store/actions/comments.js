import axios from '../../axios';
import * as actionTypes from './actionTypes';

export const fetchCommentsStart=()=>{
	return {
		type:actionTypes.FETCH_COMMENTS_START
	}
};

export const fetchCommentsSuccess=(data)=>{
	return {
		type:actionTypes.FETCH_COMMENTS_SUCCESS,
		data:data
	}
};

export const fetchCommentsFail=(err)=>{
	return {
		type:actionTypes.FETCH_COMMENTS_FAIL,
		err:err
	}
}

export const fetchComments=(id)=>{
	return dispatch=>{
		dispatch(fetchCommentsStart());
		axios.get(`comments/${id}`)
		.then(res=>{
			console.log(res);
			dispatch(fetchCommentsSuccess(res.data));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchCommentsFail(err));
		})
	}
}

export const addComment=(data)=>{
	return {
		type:actionTypes.ADD_COMMENT,
		data:data
	}
}

export const postComment=(id,data)=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Content-Type':'application/json',
			'Authorization':`bearer ${token}`
		};
		axios.post(`/comments/${id}`,data,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(addComment(res.data));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchCommentsFail(err));
		})
	}
}

export const deleteComment=(id)=>{
	return{
		type:actionTypes.DELETE_COMMENT,
		id:id
	}
}

export const deletingComment=(dishId,commentId)=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Content-Type':'application/json',
			'Authorization':`bearer ${token}`
		};
		axios.delete(`/comments/${dishId}/${commentId}`,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(deleteComment(commentId));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchCommentsFail(err));
		})
	}
}

export const updateComment=(id,data)=>{
	return{
		type:actionTypes.UPDATE_COMMENT,
		id:id,
		data:data
	}
}

export const updatingComment=(dishId,commentId,data)=>{
	return dispatch=>{
		const token=localStorage.getItem('token');
		const headers={
			'Content-Type':'application/json',
			'Authorization':`bearer ${token}`
		};
		axios.put(`/comments/${dishId}/${commentId}`,data,{
			headers:headers
		})
		.then(res=>{
			console.log(res);
			dispatch(updateComment(commentId,data));
		})
		.catch(err=>{
			console.log(err);
			dispatch(fetchCommentsFail(err));
		})
	}
}