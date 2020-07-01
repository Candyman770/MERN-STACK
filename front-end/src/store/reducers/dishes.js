import * as actionTypes from '../actions/actionTypes';

const initialState={
	dishes:[],
	err:null,
	loading:false,
	hasNextPage:false,
	lastPage:1,
	currentPage:1
}

const reducer=(state=initialState,action)=>{
	switch(action.type){
		case actionTypes.FETCH_START:
			return {
				...state,
				err:null,
				loading:true,
				hasNextPage:false,
				lastPage:1,
				currentPage:1
			}
		case actionTypes.FETCH_SUCCESS:
			return {
				dishes:action.dishes,
				err:null,
				loading:false,
				hasNextPage:action.pagination.hasNextPage,
				lastPage:action.pagination.lastPage,
				currentPage:action.pagination.currentPage
			}
		case actionTypes.FETCH_FAIL:
			return {
				...state,
				err:action.err,
				loading:false
			}
		default:
			return state
	}
}

export default reducer;