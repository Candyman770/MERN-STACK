import * as actionTypes from '../actions/actionTypes';

const initialState={
	loading:false,
	err:null,
	commentsInfo:{}
}

const reducer=(state=initialState,action)=>{
	switch(action.type){
		case actionTypes.FETCH_COMMENTS_START:
			return {
				...state,
				err:null,
				loading:true
			}
		case actionTypes.FETCH_COMMENTS_SUCCESS:
			return {
				commentsInfo:action.data,
				err:null,
				loading:false
			}
		case actionTypes.FETCH_COMMENTS_FAIL:
			return{
				...state,
				err:action.err,
				loading:false
			}
		case actionTypes.ADD_COMMENT:
			return{
				...state,
				commentsInfo:action.data
			}
		case actionTypes.DELETE_COMMENT:
			let newComments=[...state.commentsInfo.comments];
			const index=newComments.findIndex(c=>c._id===action.id);
			if(index>=0)
				newComments.splice(index,1);
			return{
				...state,
				commentsInfo:{
					...state.commentsInfo,
					comments:newComments
				}
			}
		case actionTypes.UPDATE_COMMENT:
			let newComment=[...state.commentsInfo.comments];
			let updatedComment;
			for(let key of newComment){
				if(key._id===action.id){
					updatedComment={
						...key,
						comment:action.data.comment,
						rating:action.data.rating
					}
					break;
				}
			}
			return{
				...state,
				commentsInfo:{
					...state.commentsInfo,
					comments:updatedComment
				}
			}
		default:
			return state;
	}
};

export default reducer;