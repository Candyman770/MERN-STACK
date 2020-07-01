import * as actionTypes from '../actions/actionTypes';

const initialState={
	favorites:[],
	err:null,
	loading:false
}

const reducer=(state=initialState,action)=>{
	switch(action.type){
		case actionTypes.FETCH_FAVORITE_START:
			return {
				...state,
				err:null,
				loading:true
			}
		case actionTypes.FETCH_FAVORITE_SUCCESS:
			return {
				favorites:action.data,
				err:null,
				loading:false
			}
		case actionTypes.FETCH_FAVORITE_FAIL:
			return {
				...state,
				err:action.err,
				loading:false
			}
		case actionTypes.ADD_FAV:
			return {
				...state,
				favorites:action.data
			}
		case actionTypes.DELETE_FAV:
			let newFavorites=[];
			if(action.id!=='ALL'){
				newFavorites=[...state.favorites]
				const index=newFavorites.findIndex(f=>f._id===action.id);
				if(index>=0)
				newFavorites.splice(index,1);
			}
			return {
				...state,
				favorites:newFavorites
			}
		default:
			return state
			
	}
}

export default reducer;