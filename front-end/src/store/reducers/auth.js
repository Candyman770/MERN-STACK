import * as actionTypes from '../actions/actionTypes';

const initialState={
	err:null,
	token:null,
	userId:null,
	loading:false,
	firstname:''
}

const reducer=(state=initialState,action)=>{
	switch(action.type){
		case actionTypes.AUTH_START:
			return {
				...state,
				err:null,
				loading:true
			}
		case actionTypes.AUTH_SUCCESS:
			return {
				token:action.token,
				userId:action.userId,
				firstname:action.firstname,
				err:null,
				loading:false
			}
		case actionTypes.AUTH_FAIL:
			return {
				...state,
				err:action.err,
				loading:false
			}
		case actionTypes.AUTH_LOGOUT:
			return {
				...state,
				token:null,
				userId:null,
				firstname:''
			}
		default:
			return state;
	}
};

export default reducer;